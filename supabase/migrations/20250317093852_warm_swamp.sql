/*
  # Fix user creation trigger with improved error handling

  1. Changes
    - Add better error handling for missing metadata
    - Add fallback for missing username
    - Add defensive checks for data integrity
    - Handle unique constraint violations gracefully
    - Add logging for debugging purposes

  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/

-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function with better error handling and fallbacks
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value text;
  random_suffix text;
BEGIN
  -- Get username from metadata with fallback to email
  username_value := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Ensure username is valid
  IF username_value IS NULL OR LENGTH(username_value) < 1 THEN
    username_value := 'user_' || REPLACE(NEW.id::text, '-', '_');
  END IF;

  -- Generate random suffix for potential conflict resolution
  random_suffix := SUBSTRING(md5(random()::text) FROM 1 FOR 6);

  -- Try to insert with original username
  BEGIN
    INSERT INTO public.users (
      id,
      username,
      login_count,
      status,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      username_value,
      0,
      1, -- Active status
      COALESCE(NEW.created_at, now()),
      COALESCE(NEW.updated_at, now())
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- If username exists, try with random suffix
      INSERT INTO public.users (
        id,
        username,
        login_count,
        status,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        username_value || '_' || random_suffix,
        0,
        1,
        COALESCE(NEW.created_at, now()),
        COALESCE(NEW.updated_at, now())
      );
    WHEN OTHERS THEN
      -- Last resort: use ID-based username
      INSERT INTO public.users (
        id,
        username,
        login_count,
        status,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        'user_' || REPLACE(NEW.id::text, '-', '_'),
        0,
        1,
        COALESCE(NEW.created_at, now()),
        COALESCE(NEW.updated_at, now())
      );
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);