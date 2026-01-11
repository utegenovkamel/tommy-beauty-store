-- Migration: Add images array column to products table
-- Run this in your Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Optional: Add a comment to the column
COMMENT ON COLUMN products.images IS 'Array of additional image URLs for the product';

-- Note: The main 'image' column remains as the primary/thumbnail image
-- 'images' array stores additional gallery images
