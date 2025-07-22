/*
  # Create files table and storage

  1. New Tables
    - `files`
      - `id` (uuid, primary key)
      - `name` (text, file name)
      - `size` (bigint, file size in bytes)
      - `type` (text, mime type)
      - `path` (text, storage path)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `files` table
    - Add policies for authenticated users to:
      - Read their own files
      - Upload new files
      - Delete their own files
*/

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  path text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own files"
  ON files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files"
  ON files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);