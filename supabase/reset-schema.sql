-- ============================================
-- RESET AND RECREATE ALL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing tables (in correct order due to dependencies)
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- UTILITY FUNCTION
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- PROJECTS TABLE
-- ============================================

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  start_date TEXT,
  end_date TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX projects_featured_idx ON projects(featured);
CREATE INDEX projects_status_idx ON projects(status);
CREATE INDEX projects_order_idx ON projects(order_index);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON projects FOR ALL USING (true);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON site_settings FOR ALL USING (true);

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================

CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  file TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON achievements FOR ALL USING (true);

-- ============================================
-- EXPERIENCES TABLE
-- ============================================

CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  description TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  company_url TEXT,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON experiences FOR ALL USING (true);

-- ============================================
-- QUOTES TABLE
-- ============================================

CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON quotes FOR SELECT USING (true);
CREATE POLICY "Allow all access for authenticated users" ON quotes FOR ALL USING (true);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Site Settings (empty placeholders - update via Admin Dashboard)
INSERT INTO site_settings (key, value) VALUES
('hero', '{
  "name": "",
  "title": "",
  "avatar": "/assets/avatar.png",
  "description": "",
  "resumeUrl": "/assets/resume.pdf",
  "contactUrl": "/contact",
  "skills": []
}'::jsonb),
('about', '{
  "name": "",
  "description": "",
  "skills": []
}'::jsonb),
('socialLinks', '[]'::jsonb),
('contact', '{
  "title": "Contact",
  "description": "",
  "email": ""
}'::jsonb),
('cta', '{
  "profileImage": "/assets/avatar.png",
  "preText": "",
  "linkText": "Book a Call",
  "calLink": ""
}'::jsonb),
('footer', '{
  "developer": "",
  "text": "Design & Developed by",
  "copyright": "All rights reserved."
}'::jsonb);

-- No sample projects - add via Admin Dashboard

-- No sample quotes - add via Admin Dashboard

-- Verify tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
