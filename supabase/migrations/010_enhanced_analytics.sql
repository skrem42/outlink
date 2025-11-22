-- Enhanced Analytics Events Table
-- Add additional columns for detailed analytics tracking

ALTER TABLE analytics_events
ADD COLUMN IF NOT EXISTS browser text,
ADD COLUMN IF NOT EXISTS os text,
ADD COLUMN IF NOT EXISTS screen_resolution text,
ADD COLUMN IF NOT EXISTS utm_source text,
ADD COLUMN IF NOT EXISTS utm_medium text,
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS session_id uuid,
ADD COLUMN IF NOT EXISTS is_bot boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS page_load_time integer,
ADD COLUMN IF NOT EXISTS latitude decimal(10, 8),
ADD COLUMN IF NOT EXISTS longitude decimal(11, 8);

-- Create index on session_id for faster session queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- Create index on utm parameters for marketing analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_source ON analytics_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_medium ON analytics_events(utm_medium);
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_campaign ON analytics_events(utm_campaign);

-- Create index on browser and os for device analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_browser ON analytics_events(browser);
CREATE INDEX IF NOT EXISTS idx_analytics_events_os ON analytics_events(os);

-- Create index on is_bot for filtering
CREATE INDEX IF NOT EXISTS idx_analytics_events_is_bot ON analytics_events(is_bot);

-- Create composite index for geographic queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_location ON analytics_events(country, city);

