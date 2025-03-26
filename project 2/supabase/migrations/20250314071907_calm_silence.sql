/*
  # Fix Contact Submissions RLS Policy

  1. Changes
    - Allow public (unauthenticated) access for contact form submissions
    - Maintain existing policies for authenticated users
    - Ensure user_id remains optional

  2. Security
    - Enable submissions without authentication
    - Preserve data access controls for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON contact_submissions;

-- Create new policies
CREATE POLICY "Enable contact form submissions for all users"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

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