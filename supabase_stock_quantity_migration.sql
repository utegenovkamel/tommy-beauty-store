-- Migration: Add stock_quantity column to products table
-- Run this in your Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT NULL;

-- Optional: Add a comment to the column
COMMENT ON COLUMN products.stock_quantity IS 'Number of items in stock (null = not tracked)';

