-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (mock for now)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_clicks INTEGER DEFAULT 0,
  total_revenue NUMERIC(12, 2) DEFAULT 0,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domains table
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'expired')),
  verified BOOLEAN DEFAULT FALSE,
  ssl_enabled BOOLEAN DEFAULT FALSE,
  clicks INTEGER DEFAULT 0,
  connected_links INTEGER DEFAULT 0,
  registered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  registrar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  link_type TEXT NOT NULL CHECK (link_type IN ('whitehat', 'greyhat', 'blackhat')),
  platform TEXT,
  domain TEXT NOT NULL,
  path TEXT NOT NULL,
  full_url TEXT GENERATED ALWAYS AS (domain || '/' || path) STORED,
  destination_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  status BOOLEAN DEFAULT TRUE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain, path)
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'view', 'conversion')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_creators_user_id ON creators(user_id);
CREATE INDEX idx_creators_status ON creators(status);

CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_domain ON domains(domain);
CREATE INDEX idx_domains_status ON domains(status);

CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_creator_id ON links(creator_id);
CREATE INDEX idx_links_domain_id ON links(domain_id);
CREATE INDEX idx_links_domain_path ON links(domain, path);
CREATE INDEX idx_links_status ON links(status);

CREATE INDEX idx_analytics_link_id ON analytics_events(link_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_link_timestamp ON analytics_events(link_id, timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Note: Keeping these disabled for mock auth, but ready for when real auth is implemented

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies (will be enforced when auth is implemented)
-- For now, using service_role key bypasses RLS

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid());

-- Creators policies
CREATE POLICY "Users can view their own creators" ON creators
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own creators" ON creators
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own creators" ON creators
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own creators" ON creators
  FOR DELETE USING (user_id = auth.uid());

-- Domains policies
CREATE POLICY "Users can view their own domains" ON domains
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own domains" ON domains
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own domains" ON domains
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own domains" ON domains
  FOR DELETE USING (user_id = auth.uid());

-- Links policies
CREATE POLICY "Users can view their own links" ON links
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own links" ON links
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (user_id = auth.uid());

-- Analytics events policies
CREATE POLICY "Users can view analytics for their links" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = analytics_events.link_id
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Create function to update connected_links count on domains
CREATE OR REPLACE FUNCTION update_domain_connected_links()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE domains SET connected_links = connected_links + 1
    WHERE id = NEW.domain_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE domains SET connected_links = connected_links - 1
    WHERE id = OLD.domain_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.domain_id != NEW.domain_id THEN
    UPDATE domains SET connected_links = connected_links - 1
    WHERE id = OLD.domain_id;
    UPDATE domains SET connected_links = connected_links + 1
    WHERE id = NEW.domain_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_domain_links_count
AFTER INSERT OR UPDATE OR DELETE ON links
FOR EACH ROW EXECUTE FUNCTION update_domain_connected_links();

-- Create function to update click counts
CREATE OR REPLACE FUNCTION update_click_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'click' THEN
    -- Update link clicks
    UPDATE links SET clicks = clicks + 1
    WHERE id = NEW.link_id;
    
    -- Update domain clicks
    UPDATE domains SET clicks = clicks + 1
    WHERE id = (SELECT domain_id FROM links WHERE id = NEW.link_id);
    
    -- Update creator total_clicks
    UPDATE creators SET total_clicks = total_clicks + 1
    WHERE id = (SELECT creator_id FROM links WHERE id = NEW.link_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clicks_on_event
AFTER INSERT ON analytics_events
FOR EACH ROW EXECUTE FUNCTION update_click_counts();


