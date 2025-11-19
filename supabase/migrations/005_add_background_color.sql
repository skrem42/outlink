-- Add background_color column for solid background colors
ALTER TABLE landing_page_settings
ADD COLUMN background_color TEXT NOT NULL DEFAULT '#18181b';

-- Add missing columns from previous updates
ALTER TABLE landing_page_settings
ADD COLUMN IF NOT EXISTS cta_cards JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS verified_badge_style TEXT NOT NULL DEFAULT 'chip' CHECK (verified_badge_style IN ('chip', 'solid')),
ADD COLUMN IF NOT EXISTS show_domain_handle BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_display_mode TEXT NOT NULL DEFAULT 'full' CHECK (profile_display_mode IN ('full', 'avatar'));


