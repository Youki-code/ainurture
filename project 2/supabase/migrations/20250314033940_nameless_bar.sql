/*
  # Update contact submissions RLS policies

  1. Changes
    - Allow unauthenticated users to submit contact forms
    - Make user_id optional
    - Maintain existing policies for authenticated users

  2. Security
    - Enable submissions without authentication
    - Preserve data access controls for authenticated users
*/

-- Make user_id optional
ALTER TABLE contact_submissions
  ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON contact_submissions;

-- Create new policies
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);