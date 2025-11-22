-- Landing page settings table for customizing whitehat link pages
CREATE TABLE landing_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL UNIQUE REFERENCES links(id) ON DELETE CASCADE,
  avatar_url TEXT,
  display_name TEXT,
  bio TEXT,
  background_gradient JSONB DEFAULT '{"start": "#8B5CF6", "end": "#EC4899"}',
  button_style TEXT NOT NULL DEFAULT 'gradient' CHECK (button_style IN ('default', 'gradient', 'outline', 'solid')),
  button_color TEXT NOT NULL DEFAULT 'primary' CHECK (button_color IN ('primary', 'success', 'warning', 'secondary', 'danger')),
  social_links JSONB DEFAULT '[]',
  verified_badge BOOLEAN DEFAULT FALSE,
  show_follower_count BOOLEAN DEFAULT FALSE,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_landing_page_settings_link_id ON landing_page_settings(link_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_landing_page_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER landing_page_settings_updated_at
  BEFORE UPDATE ON landing_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_page_settings_updated_at();



