/*
  # Update contact submissions table

  1. Changes
    - Remove subject column
    - Add phone column
    - Make message optional
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE contact_submissions
  DROP COLUMN subject,
  ADD COLUMN phone text,
  ALTER COLUMN message DROP NOT NULL;