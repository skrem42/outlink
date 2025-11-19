-- Comprehensive seed data for Outlink development
-- Run this after migrations 001 and 002

-- =====================================================
-- USERS
-- =====================================================

-- Create mock user
INSERT INTO users (id, email, name, avatar_url, created_at, updated_at) VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@outlink.bio', 'Demo User', 'https://i.pravatar.cc/150?u=demo', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CREATORS
-- =====================================================

INSERT INTO creators (id, user_id, name, email, avatar_url, tier, status, total_clicks, total_revenue, joined_date) VALUES
-- Active Pro Creators
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Sophie Rain', 'sophie.rain@example.com', 'https://i.pravatar.cc/150?u=sophie', 'premium', 'active', 45678, 12450.50, '2024-01-15'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Bella Poarch', 'bella.poarch@example.com', 'https://i.pravatar.cc/150?u=bella', 'premium', 'active', 38934, 9876.25, '2024-01-20'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Amelia Rose', 'amelia.rose@example.com', 'https://i.pravatar.cc/150?u=amelia', 'pro', 'active', 23456, 5432.75, '2024-02-01'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Luna Love', 'luna.love@example.com', 'https://i.pravatar.cc/150?u=luna', 'pro', 'active', 19823, 4567.00, '2024-02-10'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Scarlett Kiss', 'scarlett.kiss@example.com', 'https://i.pravatar.cc/150?u=scarlett', 'premium', 'active', 34567, 8234.50, '2024-02-15'),

-- Free Tier Creators
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'Jade Stone', 'jade.stone@example.com', 'https://i.pravatar.cc/150?u=jade', 'free', 'active', 5432, 0, '2024-03-01'),
('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'Maya Winters', 'maya.winters@example.com', 'https://i.pravatar.cc/150?u=maya', 'free', 'active', 3456, 0, '2024-03-05'),
('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'Eva Diamond', 'eva.diamond@example.com', 'https://i.pravatar.cc/150?u=eva', 'pro', 'active', 15678, 3456.00, '2024-03-10'),

-- Inactive Creator
('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'Inactive Creator', 'inactive@example.com', 'https://i.pravatar.cc/150?u=inactive', 'free', 'inactive', 0, 0, '2024-01-01')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DOMAINS
-- =====================================================

INSERT INTO domains (id, user_id, domain, status, verified, ssl_enabled, clicks, connected_links, registered_date, expiry_date, registrar) VALUES
-- Custom Domains (Premium)
('d1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'sophierain.com', 'active', true, true, 45678, 0, '2024-01-15', '2025-01-15', 'Namecheap'),
('d2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'bellapoarch.link', 'active', true, true, 38934, 0, '2024-01-20', '2025-01-20', 'GoDaddy'),
('d3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'ameliarose.bio', 'active', true, true, 23456, 0, '2024-02-01', '2025-02-01', 'Namecheap'),
('d4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'lunalove.com', 'active', true, true, 19823, 0, '2024-02-10', '2025-02-10', 'Cloudflare'),
('d5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'scarlettkiss.link', 'active', true, true, 34567, 0, '2024-02-15', '2025-02-15', 'Namecheap'),
('d6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'jadestone.bio', 'active', true, true, 5432, 0, '2024-03-01', '2025-03-01', 'GoDaddy'),

-- Pending Domains
('d7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'mayawinters.com', 'pending', false, false, 0, 0, '2024-03-05', '2025-03-05', 'Namecheap'),
('d8888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'evadiamond.link', 'pending', false, false, 0, 0, '2024-03-10', '2025-03-10', 'Cloudflare')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LINKS
-- =====================================================

INSERT INTO links (id, user_id, creator_id, domain_id, link_type, platform, domain, path, destination_url, title, description, status, clicks) VALUES
-- Sophie Rain's Links (Premium Creator)
('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'whitehat', 'instagram', 'sophierain.com', 'instagram', 'https://instagram.com/sophierain', 'My Instagram', 'Follow me on Instagram for daily content!', true, 15234),
('a1111112-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'greyhat', 'onlyfans', 'sophierain.com', 'exclusive', 'https://onlyfans.com/sophierain', 'Exclusive Content', '18+ exclusive content', true, 18456),
('a1111113-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'whitehat', 'tiktok', 'sophierain.com', 'tiktok', 'https://tiktok.com/@sophierain', 'TikTok Videos', 'Watch my latest TikTok videos', true, 11988),

-- Bella Poarch's Links (Premium Creator)
('a2222221-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'whitehat', 'tiktok', 'bellapoarch.link', 'tiktok', 'https://tiktok.com/@bellapoarch', 'Official TikTok', 'My official TikTok account', true, 20145),
('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'blackhat', 'twitter', 'bellapoarch.link', 'twitter', 'https://twitter.com/bellapoarch', NULL, NULL, true, 10234),
('a2222223-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'greyhat', 'fansly', 'bellapoarch.link', 'premium', 'https://fansly.com/bellapoarch', 'Premium Content', 'Exclusive premium content', true, 8555),

-- Amelia Rose's Links (Pro Creator)
('a3333331-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'whitehat', 'instagram', 'ameliarose.bio', 'insta', 'https://instagram.com/ameliarose', 'Instagram Profile', 'Follow for daily updates', true, 12456),
('a3333332-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'whitehat', 'youtube', 'ameliarose.bio', 'youtube', 'https://youtube.com/@ameliarose', 'YouTube Channel', 'Subscribe to my channel', true, 11000),

-- Luna Love's Links (Pro Creator)
('a4444441-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 'greyhat', 'onlyfans', 'lunalove.com', 'of', 'https://onlyfans.com/lunalove', 'OnlyFans', 'Exclusive content on OnlyFans', true, 9823),
('a4444442-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', 'blackhat', 'instagram', 'lunalove.com', 'ig', 'https://instagram.com/lunalove', NULL, NULL, true, 10000),

-- Scarlett Kiss's Links (Premium Creator)
('a5555551-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'd5555555-5555-5555-5555-555555555555', 'whitehat', 'tiktok', 'scarlettkiss.link', 'tiktok', 'https://tiktok.com/@scarlettkiss', 'TikTok', 'Latest TikTok videos', true, 18234),
('a5555552-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'd5555555-5555-5555-5555-555555555555', 'greyhat', 'fansly', 'scarlettkiss.link', 'fansly', 'https://fansly.com/scarlettkiss', 'Fansly Premium', '18+ premium content', true, 16333),

-- Jade Stone's Links (Free Creator)
('a6666661-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'd6666666-6666-6666-6666-666666666666', 'whitehat', 'instagram', 'jadestone.bio', 'instagram', 'https://instagram.com/jadestone', 'Instagram', 'My Instagram profile', true, 5432),

-- Links on default domains
('a7777771-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', NULL, 'whitehat', 'twitter', 'outlink.bio', 'maya', 'https://twitter.com/mayawinters', 'Twitter', 'Follow me on Twitter', true, 3456),
('a8888881-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', '88888888-8888-8888-8888-888888888888', NULL, 'whitehat', 'youtube', 'clickfor.bio', 'eva', 'https://youtube.com/@evadiamond', 'YouTube', 'My YouTube channel', true, 7234),
('a8888882-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', '88888888-8888-8888-8888-888888888888', NULL, 'blackhat', 'patreon', 'clickfor.bio', 'support', 'https://patreon.com/evadiamond', NULL, NULL, true, 8444),

-- Inactive Links
('a9999991-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'whitehat', 'custom', 'sophierain.com', 'old-link', 'https://example.com/old', 'Old Link', 'Inactive link', false, 234)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ANALYTICS EVENTS
-- =====================================================

-- Generate events for the past 90 days
DO $$
DECLARE
  link_record RECORD;
  day_offset INTEGER;
  events_per_day INTEGER;
  i INTEGER;
  event_timestamp TIMESTAMP;
  event_types TEXT[] := ARRAY['click', 'view', 'conversion'];
  event_type TEXT;
  countries TEXT[] := ARRAY['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR'];
  cities TEXT[] := ARRAY['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Tokyo', 'São Paulo'];
  devices TEXT[] := ARRAY['mobile', 'desktop', 'tablet'];
  referrers TEXT[] := ARRAY['https://google.com', 'https://twitter.com', 'https://instagram.com', 'https://tiktok.com', 'direct', NULL];
BEGIN
  -- For each active link
  FOR link_record IN SELECT id, clicks FROM links WHERE status = true LOOP
    -- Generate events for the past 90 days
    FOR day_offset IN 0..89 LOOP
      -- Vary events per day (more recent = more events)
      events_per_day := FLOOR(RANDOM() * 50) + 10 + (90 - day_offset);
      
      FOR i IN 1..events_per_day LOOP
        -- Random timestamp within the day
        event_timestamp := NOW() - (day_offset || ' days')::INTERVAL + (RANDOM() * INTERVAL '24 hours');
        
        -- Weighted event types: 60% click, 35% view, 5% conversion
        IF RANDOM() < 0.60 THEN
          event_type := 'click';
        ELSIF RANDOM() < 0.95 THEN
          event_type := 'view';
        ELSE
          event_type := 'conversion';
        END IF;
        
        INSERT INTO analytics_events (
          link_id,
          event_type,
          timestamp,
          ip_address,
          user_agent,
          referrer,
          country,
          city,
          device_type
        ) VALUES (
          link_record.id,
          event_type,
          event_timestamp,
          CONCAT(FLOOR(RANDOM() * 255)::TEXT, '.', FLOOR(RANDOM() * 255)::TEXT, '.', FLOOR(RANDOM() * 255)::TEXT, '.', FLOOR(RANDOM() * 255)::TEXT),
          CASE 
            WHEN RANDOM() < 0.6 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
            WHEN RANDOM() < 0.9 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ELSE 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
          END,
          referrers[FLOOR(RANDOM() * array_length(referrers, 1)) + 1],
          countries[FLOOR(RANDOM() * array_length(countries, 1)) + 1],
          cities[FLOOR(RANDOM() * array_length(cities, 1)) + 1],
          devices[FLOOR(RANDOM() * array_length(devices, 1)) + 1]
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Update click counts based on actual analytics events
UPDATE links SET clicks = (
  SELECT COUNT(*) FROM analytics_events 
  WHERE analytics_events.link_id = links.id 
  AND analytics_events.event_type = 'click'
) WHERE status = true;

-- Update domain clicks
UPDATE domains SET clicks = (
  SELECT COALESCE(SUM(links.clicks), 0) FROM links 
  WHERE links.domain_id = domains.id
);

-- Update creator stats
UPDATE creators SET 
  total_clicks = (
    SELECT COALESCE(SUM(links.clicks), 0) FROM links 
    WHERE links.creator_id = creators.id
  ),
  total_revenue = (
    SELECT COALESCE(SUM(links.clicks), 0) * 0.25 FROM links 
    WHERE links.creator_id = creators.id
  );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Display summary of created data
DO $$
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'Seed Data Summary:';
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'Users: %', (SELECT COUNT(*) FROM users);
  RAISE NOTICE 'Creators: %', (SELECT COUNT(*) FROM creators);
  RAISE NOTICE 'Domains: %', (SELECT COUNT(*) FROM domains);
  RAISE NOTICE 'Links: %', (SELECT COUNT(*) FROM links);
  RAISE NOTICE 'Analytics Events: %', (SELECT COUNT(*) FROM analytics_events);
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'Total Clicks: %', (SELECT SUM(clicks) FROM links);
  RAISE NOTICE 'Total Revenue: $%', (SELECT SUM(total_revenue) FROM creators);
  RAISE NOTICE '==================================================';
END $$;

