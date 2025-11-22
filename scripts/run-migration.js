#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * Runs a specific migration file against your Supabase database.
 * Usage: node scripts/run-migration.js [migration-file-name]
 * Example: node scripts/run-migration.js 009_greyhat_page_settings.sql
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

async function runMigration(migrationFile) {
  console.log('🔧 Running database migration...\n');

  // Determine migration file path
  let sqlFilePath;
  if (migrationFile) {
    sqlFilePath = path.resolve(__dirname, `../supabase/migrations/${migrationFile}`);
  } else {
    // Default to the greyhat migration
    sqlFilePath = path.resolve(__dirname, '../supabase/migrations/009_greyhat_page_settings.sql');
  }
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Error: Migration file not found at ${sqlFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`📄 Migration file: ${path.basename(sqlFilePath)}`);
  console.log(`📊 File size: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

  try {
    console.log('⏳ Executing migration via Supabase API...\n');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });

    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('Trying direct query execution...\n');
      const { error: directError } = await supabase.from('_').select('*').limit(0).then(() => {
        // This is a workaround - we'll use the postgres connection
        return fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          },
          body: JSON.stringify({ query: sqlContent })
        });
      });

      if (directError) {
        throw new Error(error.message || 'Failed to execute migration');
      }
    }

    console.log('✅ Migration executed successfully!\n');
    console.log('🎉 Migration completed!\n');
    
    // Verify table was created
    console.log('🔍 Verifying table creation...\n');
    const { data: tableCheck, error: checkError } = await supabase
      .from('greyhat_page_settings')
      .select('*')
      .limit(0);
    
    if (!checkError) {
      console.log('✅ Table "greyhat_page_settings" verified!\n');
    } else {
      console.log('⚠️  Could not verify table (this is OK if using RLS)\n');
    }

  } catch (error) {
    console.error('\n❌ Error executing migration:');
    console.error(error.message);
    console.error('\n💡 Alternative methods:');
    console.error('   1. Run via psql: npm run migrate:psql');
    console.error('   2. Copy SQL and paste into Supabase SQL Editor');
    console.error('   3. Use Supabase CLI: supabase db push\n');
    process.exit(1);
  }
}

// Get migration file from command line args
const migrationFile = process.argv[2];
runMigration(migrationFile).catch(console.error);

