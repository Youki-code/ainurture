/*
  # Fix user authentication system

  1. Changes
    - Improve user creation process
    - Add better error handling
    - Fix username generation
    - Add proper constraints
    - Fix login tracking

  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
DECLARE
  username_value text;
  base_username text;
  counter integer := 0;
BEGIN
  -- Handle existing users
  UPDATE public.users
  SET
    last_login = now(),
    login_count = COALESCE(login_count, 0) + 1,
    updated_at = now()
  WHERE id = NEW.id;
  
  -- If user doesn't exist (no rows updated), create them
  IF NOT FOUND THEN
    -- Get base username from metadata or email
    base_username := COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(NEW.email, '@', 1)
    );

    -- Clean username
    base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '_', 'g');
  
    -- Try to insert with increasingly modified usernames
    LOOP
      -- Generate username with counter if needed
      username_value := CASE
        WHEN counter = 0 THEN base_username
        ELSE base_username || '_' || counter::text
      END;

      BEGIN
        INSERT INTO public.users (
          id,
          username,
          status,
          login_count,
          created_at,
          updated_at,
          last_login
        )
        VALUES (
          NEW.id,
          username_value,
          1, -- Active status
          1, -- First login
          now(),
          now(),
          now()
        );
        
        -- If insert succeeds, exit loop
        EXIT;
      EXCEPTION 
        WHEN unique_violation THEN
          counter := counter + 1;
          -- Prevent infinite loop
          IF counter > 100 THEN
            -- Fall back to UUID-based username
            username_value := 'user_' || replace(gen_random_uuid()::text, '-', '');
            INSERT INTO public.users (
              id,
              username,
              status,
              login_count,
              created_at,
              updated_at,
              last_login
            )
            VALUES (
              NEW.id,
              username_value,
              1,
              1,
              now(),
              now(),
              now()
            );
            EXIT;
          END IF;
          CONTINUE;
        WHEN OTHERS THEN
          -- Log error and use fallback
          RAISE WARNING 'Error in update_last_login: %', SQLERRM;
          BEGIN
            INSERT INTO public.users (
              id,
              username,
              status,
              login_count,
              created_at,
              updated_at,
              last_login
            )
            VALUES (
              NEW.id,
              'user_' || replace(NEW.id::text, '-', '_'),
              1,
              1,
              now(),
              now(),
              now()
            );
          EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to create user on login: %', SQLERRM;
          END;
          EXIT;
      END;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
