#!/usr/bin/env node

/**
 * Create Greyhat Page Settings Table using PostgreSQL client
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: Missing DATABASE_URL');
  console.error('\n💡 Please add DATABASE_URL to your .env.local file');
  console.error('   Get it from: Supabase Dashboard → Settings → Database → Connection String\n');
  
  // Print the SQL for manual execution
  printManualInstructions();
  process.exit(1);
}

function printManualInstructions() {
  const sql = fs.readFileSync(
    path.resolve(__dirname, '../supabase/migrations/009_greyhat_page_settings.sql'),
    'utf8'
  );
  
  console.log('\n📋 MANUAL SETUP INSTRUCTIONS:');
  console.log('════════════════════════════════════════\n');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to: SQL Editor');
  console.log('3. Click "New Query"');
  console.log('4. Copy and paste the SQL below:');
  console.log('\n─────────────────────────────────────────\n');
  console.log(sql);
  console.log('─────────────────────────────────────────\n');
  console.log('5. Click "Run" to execute');
  console.log('6. Verify the table was created\n');
}

async function createTableWithPg() {
  try {
    // Try to require pg
    const { Client } = require('pg');
    
    console.log('🔧 Creating greyhat_page_settings table using PostgreSQL...\n');
    
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Connected to database\n');

    // Read the migration file
    const sql = fs.readFileSync(
      path.resolve(__dirname, '../supabase/migrations/009_greyhat_page_settings.sql'),
      'utf8'
    );

    console.log('📝 Executing migration...\n');
    await client.query(sql);
    
    console.log('✅ Migration executed successfully!\n');
    
    // Verify table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'greyhat_page_settings'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ Table "greyhat_page_settings" verified!\n');
      console.log('🎉 All done! You can now use greyhat links.\n');
    }

    await client.end();
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('📦 Installing pg package...\n');
      const { execSync } = require('child_process');
      
      try {
        execSync('npm install pg', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
        console.log('\n✅ Package installed! Running migration again...\n');
        
        // Retry
        const { Client } = require('pg');
        const client = new Client({
          connectionString: DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        
        const sql = fs.readFileSync(
          path.resolve(__dirname, '../supabase/migrations/009_greyhat_page_settings.sql'),
          'utf8'
        );

        await client.query(sql);
        console.log('✅ Migration executed successfully!\n');
        
        await client.end();
        console.log('🎉 All done!\n');
        
      } catch (installError) {
        console.error('❌ Failed to install pg package');
        console.error(installError.message);
        printManualInstructions();
        process.exit(1);
      }
    } else {
      console.error('❌ Error:', error.message);
      printManualInstructions();
      process.exit(1);
    }
  }
}

createTableWithPg().catch((error) => {
  console.error('❌ Unexpected error:', error.message);
  printManualInstructions();
  process.exit(1);
});

