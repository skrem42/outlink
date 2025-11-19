#!/usr/bin/env node

/**
 * Script to run Supabase seed SQL file using psql (PostgreSQL client)
 * This is the most reliable method for large SQL files
 * 
 * Requirements: psql must be installed (comes with PostgreSQL)
 * 
 * Usage: node scripts/run-seed-psql.js
 * Or: npm run seed:psql
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: Missing database connection string');
  console.error('Required environment variable:');
  console.error('  - DATABASE_URL (or SUPABASE_DB_URL)');
  console.error('\nExample format:');
  console.error('  postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres');
  console.error('\nYou can find this in your Supabase project settings under Database > Connection String');
  process.exit(1);
}

async function runSeedSQL() {
  console.log('🌱 Starting database seed via psql...\n');

  // Read the SQL file
  const sqlFilePath = path.resolve(__dirname, '../supabase/migrations/003_seed_data.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Error: SQL file not found at ${sqlFilePath}`);
    process.exit(1);
  }

  console.log(`📄 Loaded seed file: ${sqlFilePath}`);
  const fileStats = fs.statSync(sqlFilePath);
  console.log(`📊 File size: ${(fileStats.size / 1024).toFixed(2)} KB\n`);
  console.log('⏳ Executing SQL via psql...\n');

  return new Promise((resolve, reject) => {
    // Run psql with the SQL file
    const psql = spawn('psql', [
      DATABASE_URL,
      '-f', sqlFilePath,
      '--echo-errors',
      '--quiet'
    ]);

    let stdout = '';
    let stderr = '';

    psql.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      // Print NOTICE messages from the SQL (like our summary)
      if (output.includes('NOTICE')) {
        console.log(output);
      }
    });

    psql.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      // Print errors in real-time
      if (output.trim()) {
        console.error(output);
      }
    });

    psql.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ SQL executed successfully!\n');
        console.log('🎉 Database seeding completed!\n');
        resolve();
      } else {
        console.error('\n❌ Error executing SQL');
        console.error(`psql exited with code ${code}\n`);
        
        if (stderr.includes('command not found') || stderr.includes('not recognized')) {
          console.error('💡 Tip: psql is not installed. Install PostgreSQL client:');
          console.error('   macOS: brew install postgresql');
          console.error('   Ubuntu: sudo apt-get install postgresql-client');
          console.error('   Windows: Download from https://www.postgresql.org/download/\n');
        }
        
        reject(new Error(`psql failed with code ${code}`));
      }
    });

    psql.on('error', (error) => {
      if (error.code === 'ENOENT') {
        console.error('\n❌ Error: psql command not found');
        console.error('\n💡 Install PostgreSQL client:');
        console.error('   macOS: brew install postgresql');
        console.error('   Ubuntu: sudo apt-get install postgresql-client');
        console.error('   Windows: Download from https://www.postgresql.org/download/\n');
      } else {
        console.error('\n❌ Error spawning psql:', error.message);
      }
      reject(error);
    });
  });
}

// Run the seed
runSeedSQL().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});


