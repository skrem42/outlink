-- Add voice_note_url column for voice note feature
ALTER TABLE landing_page_settings
ADD COLUMN IF NOT EXISTS voice_note_url TEXT;



