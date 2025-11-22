-- Seed Analytics Data with Realistic Test Data
-- This file populates the analytics_events table with test data

-- Insert test analytics events for the last 30 days
DO $$
DECLARE
  link_record RECORD;
  event_date TIMESTAMP;
  event_count INTEGER;
  i INTEGER;
BEGIN
  -- Loop through all links
  FOR link_record IN SELECT id FROM links LIMIT 5 LOOP
    -- Generate events for last 30 days
    FOR event_date IN 
      SELECT generate_series(
        NOW() - INTERVAL '30 days',
        NOW(),
        INTERVAL '1 hour'
      ) AS ts
    LOOP
      -- Random number of events per hour (0-10)
      event_count := floor(random() * 10)::int;
      
      FOR i IN 1..event_count LOOP
        -- Insert view event
        INSERT INTO analytics_events (
          link_id,
          event_type,
          timestamp,
          ip_address,
          user_agent,
          referrer,
          country,
          city,
          device_type,
          browser,
          os,
          screen_resolution,
          utm_source,
          utm_medium,
          utm_campaign,
          session_id,
          is_bot,
          page_load_time,
          latitude,
          longitude
        ) VALUES (
          link_record.id,
          'view',
          event_date + (random() * INTERVAL '1 hour'),
          '192.168.' || floor(random() * 255)::int || '.' || floor(random() * 255)::int,
          CASE floor(random() * 4)::int
            WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
            WHEN 1 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/95.0.4638.69'
            WHEN 2 THEN 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            ELSE 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36'
          END,
          CASE floor(random() * 5)::int
            WHEN 0 THEN 'https://google.com'
            WHEN 1 THEN 'https://facebook.com'
            WHEN 2 THEN 'https://twitter.com'
            WHEN 3 THEN 'https://instagram.com'
            ELSE NULL
          END,
          CASE floor(random() * 6)::int
            WHEN 0 THEN 'United States'
            WHEN 1 THEN 'United Kingdom'
            WHEN 2 THEN 'Canada'
            WHEN 3 THEN 'Australia'
            WHEN 4 THEN 'Germany'
            ELSE 'France'
          END,
          CASE floor(random() * 10)::int
            WHEN 0 THEN 'New York'
            WHEN 1 THEN 'London'
            WHEN 2 THEN 'Toronto'
            WHEN 3 THEN 'Sydney'
            WHEN 4 THEN 'Berlin'
            WHEN 5 THEN 'Paris'
            WHEN 6 THEN 'Los Angeles'
            WHEN 7 THEN 'Chicago'
            WHEN 8 THEN 'Miami'
            ELSE 'Seattle'
          END,
          CASE floor(random() * 3)::int
            WHEN 0 THEN 'mobile'
            WHEN 1 THEN 'desktop'
            ELSE 'tablet'
          END,
          CASE floor(random() * 5)::int
            WHEN 0 THEN 'Chrome'
            WHEN 1 THEN 'Safari'
            WHEN 2 THEN 'Firefox'
            WHEN 3 THEN 'Edge'
            ELSE 'Opera'
          END,
          CASE floor(random() * 4)::int
            WHEN 0 THEN 'iOS'
            WHEN 1 THEN 'Android'
            WHEN 2 THEN 'Windows'
            ELSE 'MacOS'
          END,
          CASE floor(random() * 5)::int
            WHEN 0 THEN '1920x1080'
            WHEN 1 THEN '1366x768'
            WHEN 2 THEN '375x667'
            WHEN 3 THEN '414x896'
            ELSE '1440x900'
          END,
          CASE floor(random() * 4)::int
            WHEN 0 THEN 'instagram'
            WHEN 1 THEN 'tiktok'
            WHEN 2 THEN 'twitter'
            ELSE NULL
          END,
          CASE floor(random() * 3)::int
            WHEN 0 THEN 'social'
            WHEN 1 THEN 'paid'
            ELSE NULL
          END,
          CASE floor(random() * 3)::int
            WHEN 0 THEN 'summer_promo'
            WHEN 1 THEN 'launch_campaign'
            ELSE NULL
          END,
          gen_random_uuid(),
          random() < 0.05, -- 5% bot traffic
          (random() * 3000 + 500)::int, -- 500-3500ms load time
          (random() * 180 - 90), -- latitude
          (random() * 360 - 180) -- longitude
        );
        
        -- 60% chance of click after view
        IF random() < 0.6 THEN
          INSERT INTO analytics_events (
            link_id,
            event_type,
            timestamp,
            ip_address,
            user_agent,
            referrer,
            country,
            city,
            device_type,
            browser,
            os,
            screen_resolution,
            utm_source,
            utm_medium,
            utm_campaign,
            session_id,
            is_bot,
            page_load_time,
            latitude,
            longitude
          ) SELECT 
            link_id,
            'click',
            timestamp + INTERVAL '5 seconds',
            ip_address,
            user_agent,
            referrer,
            country,
            city,
            device_type,
            browser,
            os,
            screen_resolution,
            utm_source,
            utm_medium,
            utm_campaign,
            session_id,
            is_bot,
            page_load_time,
            latitude,
            longitude
          FROM analytics_events 
          WHERE link_id = link_record.id 
          ORDER BY timestamp DESC 
          LIMIT 1;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Update link click counts
UPDATE links l
SET clicks = (
  SELECT COUNT(*) 
  FROM analytics_events ae 
  WHERE ae.link_id = l.id AND ae.event_type = 'click'
);

