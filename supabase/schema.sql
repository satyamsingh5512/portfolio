-- Supabase Schema for Portfolio
-- Run this in your Supabase SQL Editor to create all tables

-- ============================================
-- PROJECTS TABLE
-- ============================================

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_order_idx ON projects(order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
-- Note: In production, you may want to restrict this further
CREATE POLICY "Allow all access for authenticated users" ON projects
  FOR ALL USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function on updates
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing projects data
INSERT INTO projects (title, short_description, description, technologies, github_url, live_url, image, featured, status, start_date, end_date, category, order_index) VALUES
('2D Game Engine', 'A simple 2D game engine written in C++ using SDL2 for graphics and Lua for scripting', 'A simple 2D game engine written in C++ using SDL2 for graphics and Lua for scripting', ARRAY['C++', 'SDL2', 'Lua'], 'https://github.com/satyamskillz/2D-Game-Engine', NULL, '/project/2dgame.png', true, 'completed', NULL, NULL, NULL, 0),
('Cosmic Chaos', 'An arcade-style game built with the 2D game engine. Features procedurally generated levels and physics-based gameplay.', 'An arcade-style game built with the 2D game engine. Features procedurally generated levels and physics-based gameplay.', ARRAY['C++', 'Lua', 'SDL2'], 'https://github.com/satyamskillz/CosmicChaos', 'https://satyam.is-a.dev/CosmicChaos/', '/project/cosmic-chaos.png', true, 'completed', NULL, NULL, NULL, 1),
('Portfolio', 'My Portfolio Website - A personal portfolio website to showcase my projects and blog posts', 'My Portfolio Website - A personal portfolio website to showcase my projects and blog posts', ARRAY['Typescript', 'NextJS', 'TailwindCSS'], 'https://github.com/satyamskillz/Portfolio', 'https://satyam.is-a.dev', '/project/portfolio.png', true, 'completed', NULL, NULL, NULL, 2),
('BarberShop Appointment App', 'A MERN-based platform for barbershop appointment scheduling. Developed for AP Computer Science Principles: Create Performance Task, featuring role-based dashboards for customers and barbers.', 'A MERN-based platform for barbershop appointment scheduling. Developed for AP Computer Science Principles: Create Performance Task, featuring role-based dashboards for customers and barbers.', ARRAY['Typescript', 'React', 'Node.js', 'Express', 'MongoDB'], 'https://github.com/satyamskillz/Barbershop-Appointment-App', NULL, '/project/barber.png', true, 'completed', NULL, NULL, NULL, 3),
('Event Poster Generator', 'A web app that generates event posters based on user input using jsPDF', 'A web app that generates event posters based on user input using jsPDF', ARRAY['HTML', 'CSS', 'JavaScript', 'jsPDF'], 'https://github.com/satyamskillz/Event-Poster-Generator', 'https://event-poster-generator.vercel.app', '/project/event-poster.png', true, 'completed', NULL, NULL, NULL, 4),
('Smart Dustbin', 'An automatic dustbin that opens when it detects a hand using an ultrasonic sensor', 'An automatic dustbin that opens when it detects a hand using an ultrasonic sensor', ARRAY['Arduino', 'HC-SR04', 'Servo Motor', 'C++'], 'https://github.com/satyamskillz/Smart-Dustbin', NULL, '/project/smart-dustbin.png', false, 'completed', NULL, NULL, NULL, 5),
('Tic Tac Toe', 'A simple Tic Tac Toe game written in Python', 'A simple Tic Tac Toe game written in Python', ARRAY['Python', 'Pygame'], 'https://github.com/satyamskillz/TicTacToe-2', NULL, '/project/tictactoe.png', false, 'completed', NULL, NULL, NULL, 6),
('GDG Prayagraj Website', 'The official website for Google Developer Group Prayagraj', 'The official website for Google Developer Group Prayagraj', ARRAY['Typescript', 'NextJS', 'TailwindCSS'], NULL, 'https://gdgprayagraj.in', '/project/gdgprayagraj.png', true, 'completed', NULL, NULL, NULL, 7),
('Rephyr', 'Rephyr is a virtual study companion for students, designed to enhance productivity and learning.', 'Rephyr is a virtual study companion for students, designed to enhance productivity and learning.', ARRAY['Typescript', 'NextJS', 'AI'], NULL, 'https://rephyr.vercel.app', '/project/rephyr.png', true, 'completed', NULL, NULL, NULL, 8);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================

-- Create site_settings table for storing all site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

-- Create policy to allow all access (for admin operations)
CREATE POLICY "Allow all access for authenticated users" ON site_settings
  FOR ALL USING (true);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('hero', '{
  "name": "Satyam",
  "title": "Full Stack Developer",
  "avatar": "/assets/satyam-avatar.png",
  "description": "I am a <b>Full Stack Software Engineer</b> focused on designing and building scalable, production-ready systems that perform reliably under real-world constraints. My core strength lies in architecting backend services, crafting high-performance web applications, and designing resilient data models.",
  "resumeUrl": "/assets/resume.pdf",
  "contactUrl": "/contact",
  "skills": [
    {"name": "React", "href": "https://react.dev/"},
    {"name": "Next.js", "href": "https://nextjs.org/"},
    {"name": "Node.js", "href": "https://nodejs.org/"},
    {"name": "Express", "href": "https://expressjs.com/"},
    {"name": "PostgreSQL", "href": "https://www.postgresql.org/"},
    {"name": "MongoDB", "href": "https://www.mongodb.com/"}
  ]
}'::jsonb),
('about', '{
  "name": "Satyam",
  "description": "Hey, I''m Satyam. I''m a 3rd-year B.Tech Computer Science student and a Full-Stack Developer with strong Machine Learning expertise, focused on building scalable, production-ready systems.\n\nI work across the entire stack, from designing robust backend architectures and APIs to building clean, high-performance user interfaces. Alongside this, I actively develop and experiment with machine learning models for real-world applications.\n\nTech Focus: Full-Stack Engineering · Machine Learning · Backend Systems · Scalable Architectures · Intelligent Applications",
  "skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Next.js", "Python", "Machine Learning"]
}'::jsonb),
('socialLinks', '[
  {"name": "LinkedIn", "href": "https://www.linkedin.com/in/satym5512/", "icon": "linkedin"},
  {"name": "Github", "href": "https://github.com/satyamsingh5512", "icon": "github"},
  {"name": "Email", "href": "mailto:satyamssinghpx@gmail.com", "icon": "email"}
]'::jsonb),
('contact', '{
  "title": "Contact",
  "description": "Get in touch with me. I will get back to you as soon as possible.",
  "email": "satyamssinghpx@gmail.com"
}'::jsonb),
('cta', '{
  "profileImage": "/assets/satyam-avatar.png",
  "preText": "Hey, you scrolled this far, let''s talk.",
  "linkText": "Book a Free Call",
  "calLink": "satyamsinghpx/meeting"
}'::jsonb),
('footer', '{
  "developer": "Satyam",
  "text": "Design & Developed by",
  "copyright": "All rights reserved."
}'::jsonb);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  file TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Allow all access for authenticated users" ON achievements
  FOR ALL USING (true);

DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing achievements
INSERT INTO achievements (title, issuer, date, file) VALUES
('AWS Academy Cloud Foundations', 'Amazon Web Services', 'March 2024', '/blog/certificates/AWS Acadmey Cloud Foundatation.webp'),
('Microsoft Azure Fundamentals', 'Microsoft', 'January 2024', '/blog/certificates/microsoft-azure-fundamentals.webp'),
('Google Cloud Digital Leader', 'Google Cloud', 'February 2024', '/blog/certificates/google-cloud-digital-leader.webp'),
('Hacktoberfest 2023', 'DigitalOcean', 'October 2023', '/blog/certificates/hacktoberfest-2023.webp');

-- ============================================
-- EXPERIENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "Allow all access for authenticated users" ON experiences
  FOR ALL USING (true);

DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing experience
INSERT INTO experiences (title, company, location, start_date, end_date, description, technologies, is_current) VALUES
('Full Stack Developer', 'Freelance', 'Remote', 'January 2023', NULL, 'Building full-stack web applications for various clients using modern technologies.', ARRAY['React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB'], true);

-- ============================================
-- QUOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Allow all access for authenticated users" ON quotes
  FOR ALL USING (true);

DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing quotes
INSERT INTO quotes (text, author) VALUES
('Code is like humor. When you have to explain it, it's bad.', 'Cory House'),
('First, solve the problem. Then, write the code.', 'John Johnson'),
('Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', 'Martin Fowler'),
('Programming isn't about what you know; it's about what you can figure out.', 'Chris Pine'),
('The best error message is the one that never shows up.', 'Thomas Fuchs');
