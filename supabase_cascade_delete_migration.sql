-- Migration: Add CASCADE delete to order_items foreign key constraint
-- Run this in your Supabase SQL Editor
-- This allows products to be deleted even if they are referenced in order_items

-- First, drop the existing foreign key constraint
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Add the constraint back with ON DELETE CASCADE
-- This will automatically delete order_items when a product is deleted
ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;
