#!/usr/bin/env node

/**
 * Create Greyhat Page Settings Table
 * Direct SQL execution using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Required environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTable() {
  console.log('🔧 Creating greyhat_page_settings table...\n');

  try {
    // First, check if table exists
    console.log('🔍 Checking if table already exists...');
    const { data: existingTable, error: checkError } = await supabase
      .from('greyhat_page_settings')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ Table already exists!\n');
      return;
    }

    // Execute SQL statements one by one
    console.log('📝 Creating table...');
    
    // Use the Supabase REST API to execute raw SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: `
          -- Create greyhat_page_settings table
          CREATE TABLE IF NOT EXISTS greyhat_page_settings (
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
        `
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ Table created!\n');
    console.log('📝 Creating index...');
    
    // Create index
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        query: 'CREATE INDEX IF NOT EXISTS idx_greyhat_page_settings_link_id ON greyhat_page_settings(link_id);'
      })
    });

    console.log('✅ Index created!\n');
    console.log('📝 Creating trigger function...');
    
    // Create trigger function
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        query: `
          CREATE OR REPLACE FUNCTION update_greyhat_page_settings_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `
      })
    });

    console.log('✅ Trigger function created!\n');
    console.log('📝 Creating trigger...');
    
    // Create trigger
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        query: `
          DROP TRIGGER IF EXISTS greyhat_page_settings_updated_at ON greyhat_page_settings;
          CREATE TRIGGER greyhat_page_settings_updated_at
            BEFORE UPDATE ON greyhat_page_settings
            FOR EACH ROW
            EXECUTE FUNCTION update_greyhat_page_settings_updated_at();
        `
      })
    });

    console.log('✅ Trigger created!\n');
    
    // Verify table was created
    console.log('🔍 Verifying table...');
    const { error: verifyError } = await supabase
      .from('greyhat_page_settings')
      .select('id')
      .limit(1);
    
    if (verifyError) {
      console.log('⚠️  Verification failed, but table might exist with RLS enabled');
      console.log('   Try disabling RLS or checking Supabase dashboard\n');
    } else {
      console.log('✅ Table verified and working!\n');
    }

    console.log('🎉 All done! Greyhat table is ready to use.\n');

  } catch (error) {
    console.error('\n❌ Error creating table:');
    console.error(error.message);
    console.error('\n💡 Alternative: Copy this SQL and paste into Supabase SQL Editor:');
    console.error('\n---\n');
    console.error(`
CREATE TABLE IF NOT EXISTS greyhat_page_settings (
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

CREATE INDEX IF NOT EXISTS idx_greyhat_page_settings_link_id ON greyhat_page_settings(link_id);

CREATE OR REPLACE FUNCTION update_greyhat_page_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS greyhat_page_settings_updated_at ON greyhat_page_settings;
CREATE TRIGGER greyhat_page_settings_updated_at
  BEFORE UPDATE ON greyhat_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_greyhat_page_settings_updated_at();
    `);
    console.error('\n---\n');
    process.exit(1);
  }
}

createTable().catch(console.error);

