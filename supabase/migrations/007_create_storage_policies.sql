-- Migration: Storage Policies
-- Description: Policies for audio and covers buckets

-- Note: Run these commands in Supabase Dashboard > Storage > Policies
-- Or use Supabase CLI

-- ============================================
-- AUDIO BUCKET POLICIES
-- ============================================

-- Public read access to audio files
CREATE POLICY "Public audio read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

-- Only admins can upload audio
CREATE POLICY "Admins can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio' 
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can update audio
CREATE POLICY "Admins can update audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'audio'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete audio
CREATE POLICY "Admins can delete audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'audio'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================
-- COVERS BUCKET POLICIES
-- ============================================

-- Public read access to cover images
CREATE POLICY "Public covers read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- Only admins can upload covers
CREATE POLICY "Admins can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can update covers
CREATE POLICY "Admins can update covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'covers'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete covers
CREATE POLICY "Admins can delete covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'covers'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ============================================
-- BUCKET CONFIGURATION (Run in Supabase Dashboard)
-- ============================================

-- Audio bucket settings:
-- - Name: audio
-- - Public: true
-- - Allowed MIME types: audio/mpeg, audio/mp3, audio/wav, audio/ogg
-- - Max file size: 500MB

-- Covers bucket settings:
-- - Name: covers
-- - Public: true
-- - Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
-- - Max file size: 5MB


