-- Greyhat page settings table for age-gated landing pages
CREATE TABLE greyhat_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL UNIQUE REFERENCES links(id) ON DELETE CASCADE,
  warning_title TEXT NOT NULL DEFAULT '18+ Content Warning',
  warning_message TEXT NOT NULL DEFAULT 'You must be at least 18 years old to access this content. Please confirm your age to continue.',
  confirm_button_text TEXT NOT NULL DEFAULT 'I''m 18 or Older',
  background_color TEXT NOT NULL DEFAULT '#18181b',
  card_background_color TEXT NOT NULL DEFAULT '#27272a',
  button_color TEXT NOT NULL DEFAULT '#EC4899',
  text_color TEXT NOT NULL DEFAULT '#ffffff',
  icon_color TEXT NOT NULL DEFAULT '#EC4899',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_greyhat_page_settings_link_id ON greyhat_page_settings(link_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_greyhat_page_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER greyhat_page_settings_updated_at
  BEFORE UPDATE ON greyhat_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_greyhat_page_settings_updated_at();

