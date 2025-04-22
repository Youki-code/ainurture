/*
  # Initial Schema Setup

  1. Tables
    - users (handled by Supabase Auth)
    - contact_submissions
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - name (text)
      - email (text)
      - subject (text)
      - message (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on contact_submissions table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own submissions"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);