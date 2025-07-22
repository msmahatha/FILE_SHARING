/*
  # Create storage bucket for user files

  1. Storage
    - Create 'user-files' bucket for storing user uploads
    - Set up RLS policies for authenticated users to:
      - Upload their own files
      - Read their own files
      - Delete their own files

  2. Security
    - Enable security policies for the bucket
    - Restrict access to authenticated users only
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('user-files', 'user-files')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);