/*
  # Remove existing authentication tables and triggers

  1. Changes
    - Drop existing tables with proper dependency handling
    - Remove triggers and functions in correct order
    - Clean up auth-related objects

  2. Security
    - Maintain data integrity during cleanup
    - Handle dependencies properly
*/

-- First drop triggers that depend on functions
DROP TRIGGER IF EXISTS on_successful_login ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;

-- Now we can safely drop the functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_last_login();
DROP FUNCTION IF EXISTS log_successful_login();

-- Finally drop the tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.login_logs;
DROP TABLE IF EXISTS public.contacts;
DROP TABLE IF EXISTS public.users;