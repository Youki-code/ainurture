/*
  # User Management Schema Setup

  1. New Tables
    - users (extends auth.users)
      - id (uuid, primary key)
      - username (text)
      - status (smallint)
      - is_deleted (boolean)
      - last_login (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - contacts
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - contact_type (smallint)
      - contact_value (text)
      - is_primary (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - login_logs
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - login_time (timestamptz)
      - ip_address (text)
      - device_info (text)
      - login_status (smallint)
      - failure_reason (text)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Update users table with additional fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status smallint DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

COMMENT ON COLUMN users.status IS '1:active 2:disabled 3:pending_verification';

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_type smallint NOT NULL,
  contact_value text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_contact_type CHECK (contact_type IN (1, 2, 3))
);

COMMENT ON COLUMN contacts.contact_type IS '1:mobile 2:phone 3:address';

-- Create indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_user_type ON contacts(user_id, contact_type);

-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  login_time timestamptz DEFAULT now(),
  ip_address text NOT NULL,
  device_info text,
  login_status smallint NOT NULL,
  failure_reason text,
  
  CONSTRAINT valid_login_status CHECK (login_status IN (1, 2))
);

COMMENT ON COLUMN login_logs.login_status IS '1:success 2:failure';

-- Create indexes for login_logs
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_time ON login_logs(login_time);
CREATE INDEX IF NOT EXISTS idx_login_logs_ip ON login_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_time ON login_logs(user_id, login_time);

-- Enable RLS on new tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
CREATE POLICY "Users can view their own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for login_logs
CREATE POLICY "Users can view their own login logs"
  ON login_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to ensure only one primary contact per type per user
CREATE OR REPLACE FUNCTION maintain_single_primary_contact()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE contacts
    SET is_primary = false
    WHERE user_id = NEW.user_id
      AND contact_type = NEW.contact_type
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for maintaining single primary contact
DROP TRIGGER IF EXISTS ensure_single_primary_contact ON contacts;
CREATE TRIGGER ensure_single_primary_contact
  BEFORE INSERT OR UPDATE OF is_primary ON contacts
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION maintain_single_primary_contact();

-- Function to log successful logins
CREATE OR REPLACE FUNCTION log_successful_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    INSERT INTO login_logs (
      user_id,
      login_time,
      ip_address,
      device_info,
      login_status
    )
    VALUES (
      NEW.id,
      NEW.last_sign_in_at,
      COALESCE(current_setting('request.headers', true)::json->>'x-real-ip', '0.0.0.0'),
      current_setting('request.headers', true)::json->>'user-agent',
      1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for logging successful logins
DROP TRIGGER IF EXISTS on_successful_login ON auth.users;
CREATE TRIGGER on_successful_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_successful_login();