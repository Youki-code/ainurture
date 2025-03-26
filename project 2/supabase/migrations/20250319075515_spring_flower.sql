/*
  # Create Google OAuth Schema

  1. Changes
    - Create users table with Google OAuth fields
    - Create sessions table for auth management
    - Create rate limiting table
    - Add appropriate indexes and constraints

  2. Security
    - Enable RLS on all tables
    - Add email domain validation
    - Ensure secure session handling
*/

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  profile_picture text,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  email_verified boolean DEFAULT false,
  
  -- Ensure only @gmail.com addresses
  CONSTRAINT valid_email_domain CHECK (email LIKE '%@gmail.com')
);

-- Create auth sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_token CHECK (char_length(token) >= 32)
);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  ip_address text PRIMARY KEY,
  attempt_count integer DEFAULT 1,
  last_attempt timestamptz DEFAULT now(),
  blocked_until timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON public.auth_rate_limits(ip_address);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can read their own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for sessions
CREATE POLICY "Users can manage their own sessions"
  ON public.sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for rate limits
CREATE POLICY "Public can access rate limits"
  ON public.auth_rate_limits
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);