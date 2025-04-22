/*
  # Update Contact Submissions RLS Policies

  1. Changes
    - Safely drop and recreate policies if they exist
    - Ensure idempotent policy creation
    - Maintain existing functionality

  2. Security
    - Preserve public access for submissions
    - Maintain authenticated user access controls
*/

DO $$ 
BEGIN
    -- Safely drop policies if they exist
    DROP POLICY IF EXISTS "Enable contact form submissions for all users" ON contact_submissions;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contact_submissions;
    
    -- Recreate policies only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Enable contact form submissions for all users'
    ) THEN
        CREATE POLICY "Enable contact form submissions for all users"
            ON contact_submissions
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        CREATE POLICY "Enable read access for authenticated users"
            ON contact_submissions
            FOR SELECT
            TO authenticated
            USING (
                CASE 
                    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
                    ELSE false
                END
            );
    END IF;
END $$;