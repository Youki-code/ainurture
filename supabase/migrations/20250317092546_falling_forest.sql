/*
  # Fix User Registration Process

  1. Changes
    - Update handle_new_user trigger to be more robust
    - Add error handling for user creation
    - Ensure proper handling of metadata

  2. Security
    - Maintain existing security policies
    - Ensure proper user creation flow
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure we have the required metadata
  IF NEW.raw_user_meta_data IS NULL OR NEW.raw_user_meta_data->>'username' IS NULL THEN
    RAISE EXCEPTION 'Username is required in metadata';
  END IF;

  -- Insert the new user with a more defensive approach
  INSERT INTO public.users (
    id,
    username,
    login_count,
    created_at,
    updated_at,
    status
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    0,
    COALESCE(NEW.created_at, now()),
    COALESCE(NEW.updated_at, now()),
    1
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure the users table exists and has the correct structure
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    CREATE TABLE public.users (
      id uuid PRIMARY KEY REFERENCES auth.users(id),
      username text UNIQUE NOT NULL,
      last_login timestamptz,
      login_count integer DEFAULT 0,
      remember_me_token text,
      status smallint DEFAULT 1,
      is_deleted boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;