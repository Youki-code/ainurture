/*
  # Fix user login and authentication

  1. Changes
    - Add proper error handling for user login
    - Update user login tracking
    - Fix user creation trigger
    - Add proper constraints and defaults

  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_last_login();

-- Create user creation function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value text;
BEGIN
  -- Get username with proper fallback
  username_value := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1),
    'user_' || REPLACE(NEW.id::text, '-', '_')
  );

  -- Insert with conflict handling
  INSERT INTO public.users (
    id,
    username,
    status,
    login_count,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    username_value,
    1,
    0,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create login tracking function
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    last_login = now(),
    login_count = COALESCE(login_count, 0) + 1,
    updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error in update_last_login: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();

-- Ensure proper table structure
DO $$ 
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'login_count') THEN
    ALTER TABLE public.users ADD COLUMN login_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
    ALTER TABLE public.users ADD COLUMN last_login timestamptz;
  END IF;

  -- Set defaults for existing rows
  UPDATE public.users 
  SET 
    login_count = COALESCE(login_count, 0),
    status = COALESCE(status, 1)
  WHERE login_count IS NULL OR status IS NULL;

  -- Add constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name = 'users' AND column_name = 'username') THEN
    ALTER TABLE public.users ADD CONSTRAINT users_username_key UNIQUE (username);
  END IF;
END $$;