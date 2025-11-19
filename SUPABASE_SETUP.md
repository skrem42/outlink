# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose an organization
4. Enter project details:
   - **Name**: outlinknext (or whatever you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development

5. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Project Settings** (gear icon in bottom left)
2. Click on **API** in the left sidebar
3. Copy the following values:
   - **Project URL** (under "Project API")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys") - Keep this secret!

## Step 3: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
MOCK_USER_ID=00000000-0000-0000-0000-000000000000
```

## Step 4: Run Database Migrations

### Migration 1: Initial Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste it into the SQL Editor in Supabase
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this is normal!

### Migration 2: Disable RLS for Development (IMPORTANT!)

Since we're using mock authentication for now, we need to disable Row Level Security:

1. In SQL Editor, click **New Query**
2. Open `supabase/migrations/002_disable_rls_for_dev.sql` from your project
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **Run**
6. You should see "Success. No rows returned"

> **Note**: RLS will be re-enabled when we implement real authentication. The policies are already defined and ready to use.

## Step 5: Verify Tables Were Created

1. In Supabase dashboard, click **Table Editor** in the left sidebar
2. You should see these tables:
   - users
   - creators
   - domains
   - links
   - analytics_events

## Step 6: Seed Sample Data (Optional)

To add sample data for testing:

1. In SQL Editor, create a new query
2. Copy this SQL:

```sql
-- Create a mock user
INSERT INTO users (id, email, name, avatar_url) VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@outlink.bio', 'Demo User', 'https://i.pravatar.cc/150?u=demo');

-- Create sample creators
INSERT INTO creators (user_id, name, email, avatar_url, tier, status) VALUES
('00000000-0000-0000-0000-000000000000', 'Sarah Johnson', 'sarah@example.com', 'https://i.pravatar.cc/150?u=sarah', 'pro', 'active'),
('00000000-0000-0000-0000-000000000000', 'Mike Chen', 'mike@example.com', 'https://i.pravatar.cc/150?u=mike', 'premium', 'active'),
('00000000-0000-0000-0000-000000000000', 'Emily Rodriguez', 'emily@example.com', 'https://i.pravatar.cc/150?u=emily', 'free', 'active');

-- Create sample domains
INSERT INTO domains (user_id, domain, status, verified, ssl_enabled, registrar) VALUES
('00000000-0000-0000-0000-000000000000', 'sophierain.com', 'active', true, true, 'Namecheap'),
('00000000-0000-0000-0000-000000000000', 'bellapoarch.link', 'active', true, true, 'GoDaddy'),
('00000000-0000-0000-0000-000000000000', 'ameliarose.bio', 'pending', false, false, 'Namecheap'),
('00000000-0000-0000-0000-000000000000', 'lunalove.com', 'active', true, true, 'Cloudflare');

-- Create sample links
INSERT INTO links (
  user_id, 
  creator_id, 
  link_type, 
  platform, 
  domain, 
  path, 
  destination_url, 
  status,
  clicks
) VALUES
(
  '00000000-0000-0000-0000-000000000000',
  (SELECT id FROM creators WHERE name = 'Sarah Johnson' LIMIT 1),
  'whitehat',
  'instagram',
  'outlink.bio',
  'myinstagram',
  'https://instagram.com/sarahjohnson',
  true,
  1234
),
(
  '00000000-0000-0000-0000-000000000000',
  (SELECT id FROM creators WHERE name = 'Mike Chen' LIMIT 1),
  'greyhat',
  'onlyfans',
  'sophierain.com',
  'exclusive',
  'https://onlyfans.com/mikechen',
  true,
  5678
),
(
  '00000000-0000-0000-0000-000000000000',
  (SELECT id FROM creators WHERE name = 'Emily Rodriguez' LIMIT 1),
  'blackhat',
  'twitter',
  'bellapoarch.link',
  'twitter',
  'https://twitter.com/emilyrodriguez',
  true,
  2341
);
```

3. Run the query
4. You should see "Success" messages

## Step 7: Restart Your Dev Server

1. Stop your Next.js dev server (Ctrl+C)
2. Start it again: `npm run dev` or `pnpm dev`
3. Navigate to the Links page - you should now see your sample data!

## Troubleshooting

### Error: "relation 'users' does not exist"
- The migration didn't run properly. Go back to Step 4 and ensure you ran the entire migration SQL.

### Error: "Invalid API key"
- Double-check your API keys in `.env.local`. Make sure there are no extra spaces or quotes.
- Restart your dev server after changing `.env.local`.

### Error: "Failed to load links"
- Check the browser console for more details
- Verify your Supabase project is running (green status in dashboard)
- Try the seed data query to ensure the database is working

### Tables are empty
- Run the seed data SQL from Step 6

## What's Next?

Once Supabase is set up and you can see links in your dashboard:

1. Test creating a new link via the "Add New Link" button
2. Test editing existing links
3. Test the analytics page
4. Test the creators and domains pages

All pages are now connected to real data!

