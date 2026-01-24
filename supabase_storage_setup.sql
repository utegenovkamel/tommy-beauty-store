-- Supabase Storage Setup for Image Uploads
-- Run this in Supabase Dashboard → SQL Editor

-- Create buckets for product images and brand logos
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images', 'product-images', true),
  ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow anyone to view images (public read)
CREATE POLICY "Public read access for product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public read access for brand-logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

-- Policy: Allow anyone to upload images (public write)
-- Note: In production, you might want to restrict this to authenticated users
CREATE POLICY "Public upload access for product-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public upload access for brand-logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-logos');

-- Policy: Allow anyone to update images
CREATE POLICY "Public update access for product-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Public update access for brand-logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-logos');

-- Policy: Allow anyone to delete images
CREATE POLICY "Public delete access for product-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

CREATE POLICY "Public delete access for brand-logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-logos');
