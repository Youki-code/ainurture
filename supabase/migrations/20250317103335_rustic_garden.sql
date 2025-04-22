/*
  # Fix user registration process

  1. Changes
    - Add better username validation and sanitization
    - Improve error handling in user creation trigger
    - Add retry mechanism for username conflicts
    - Add better fallback mechanisms
    - Add additional validation checks

  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/

-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function with improved error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value text;
  random_suffix text;
  max_attempts integer := 3;
  current_attempt integer := 0;
BEGIN
  -- Get username from metadata with fallback to email
  username_value := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Clean and validate username
  username_value := regexp_replace(username_value, '[^a-zA-Z0-9_]', '_', 'g');
  
  -- Ensure minimum length
  IF LENGTH(username_value) < 3 THEN
    username_value := 'user_' || SUBSTRING(md5(NEW.email) FROM 1 FOR 8);
  END IF;

  -- Try to insert with increasingly modified usernames
  WHILE current_attempt < max_attempts LOOP
    BEGIN
      -- Generate suffix for retry attempts
      IF current_attempt > 0 THEN
        random_suffix := SUBSTRING(md5(current_attempt::text || random()::text) FROM 1 FOR 6);
        username_value := username_value || '_' || random_suffix;
      END IF;

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

      -- If we reach here, insert was successful
      RETURN NEW;
    EXCEPTION 
      WHEN unique_violation THEN
        -- Continue to next attempt
        current_attempt := current_attempt + 1;
      WHEN OTHERS THEN
        -- Log unexpected error and use fallback
        RAISE WARNING 'Unexpected error in handle_new_user: %', SQLERRM;
        
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
  END LOOP;

  -- If we exhausted all attempts, use UUID-based username as last resort
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
    'user_' || SUBSTRING(md5(NEW.id::text || random()::text) FROM 1 FOR 12),
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

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);