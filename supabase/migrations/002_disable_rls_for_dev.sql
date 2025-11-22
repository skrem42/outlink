-- Temporarily disable RLS for development (mock auth)
-- Re-enable these when implementing real authentication

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE creators DISABLE ROW LEVEL SECURITY;
ALTER TABLE domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;

-- Note: The RLS policies are still defined and ready to be enabled
-- when real authentication is implemented. To re-enable:
-- ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;



