#!/usr/bin/env node

/**
 * Script to run Supabase seed SQL file via API
 * This avoids timeout issues when pasting large queries in the SQL editor
 * 
 * Usage: node scripts/run-seed.js
 * Or: npm run seed
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
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

// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runSeedSQL() {
  console.log('🌱 Starting database seed...\n');

  // Read the SQL file
  const sqlFilePath = path.resolve(__dirname, '../supabase/migrations/003_seed_data.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Error: SQL file not found at ${sqlFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`📄 Loaded seed file: ${sqlFilePath}`);
  console.log(`📊 File size: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

  try {
    console.log('⏳ Executing SQL via Supabase API...\n');
    
    // Execute the SQL using the Supabase REST API
    // Note: This uses the PostgREST /rpc endpoint
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      // If the RPC function doesn't exist, try direct SQL execution
      console.log('⚠️  RPC method not available, attempting direct execution...\n');
      
      // Use fetch to call the Supabase SQL endpoint directly
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: sqlContent })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      console.log('✅ SQL executed successfully via direct endpoint!\n');
    } else {
      console.log('✅ SQL executed successfully via RPC!\n');
      if (data) {
        console.log('Response:', data);
      }
    }

    // Verify the seed data
    console.log('🔍 Verifying seed data...\n');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count');
    
    const { data: creators, error: creatorsError } = await supabase
      .from('creators')
      .select('count');
    
    const { data: domains, error: domainsError } = await supabase
      .from('domains')
      .select('count');
    
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('count');

    console.log('📊 Seed Data Summary:');
    console.log('=' .repeat(50));
    if (!usersError && users) console.log(`✓ Users: ${users.length}`);
    if (!creatorsError && creators) console.log(`✓ Creators: ${creators.length}`);
    if (!domainsError && domains) console.log(`✓ Domains: ${domains.length}`);
    if (!linksError && links) console.log(`✓ Links: ${links.length}`);
    console.log('=' .repeat(50));
    console.log('\n🎉 Database seeding completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error executing SQL:\n');
    console.error(error.message || error);
    console.error('\n💡 Tip: Try running the migrations in smaller chunks or use the Supabase CLI:');
    console.error('   supabase db reset --db-url <your-database-url>\n');
    process.exit(1);
  }
}

// Run the seed
runSeedSQL().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});



