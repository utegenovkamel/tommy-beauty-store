-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for sorting
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands(sort_order);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on brands" ON brands
  FOR SELECT
  USING (true);

-- Create policy for authenticated users to manage brands (optional, adjust as needed)
CREATE POLICY "Allow authenticated users to manage brands" ON brands
  FOR ALL
  USING (true)
  WITH CHECK (true);

