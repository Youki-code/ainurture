/*
  # Fix user creation trigger

  1. Changes
    - Add better error handling for missing metadata
    - Add fallback for missing username
    - Ensure proper status handling
    - Add defensive checks for data integrity

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

  -- Insert new user with defensive approach
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
  )
  ON CONFLICT (id) DO UPDATE
  SET
    username = EXCLUDED.username,
    updated_at = EXCLUDED.updated_at
  WHERE users.username IS NULL;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle duplicate username
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
      username_value || '_' || SUBSTRING(md5(random()::text) FROM 1 FOR 6),
      0,
      1,
      COALESCE(NEW.created_at, now()),
      COALESCE(NEW.updated_at, now())
    );
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error and create user with fallback username
    RAISE WARNING 'Error creating user: %', SQLERRM;
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
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();