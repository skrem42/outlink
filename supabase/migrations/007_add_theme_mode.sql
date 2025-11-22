-- Add theme_mode column for light/dark mode support
ALTER TABLE landing_page_settings
ADD COLUMN IF NOT EXISTS theme_mode TEXT NOT NULL DEFAULT 'dark' CHECK (theme_mode IN ('light', 'dark'));



