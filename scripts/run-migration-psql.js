#!/usr/bin/env node

/**
 * Database Migration Runner (psql method)
 * 
 * Runs a specific migration file via psql command.
 * Usage: node scripts/run-migration-psql.js [migration-file-name]
 * Example: node scripts/run-migration-psql.js 009_greyhat_page_settings.sql
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

async function runMigration(migrationFile) {
  console.log('🔧 Running database migration via psql...\n');

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

  console.log(`📄 Migration file: ${path.basename(sqlFilePath)}`);
  const fileStats = fs.statSync(sqlFilePath);
  console.log(`📊 File size: ${(fileStats.size / 1024).toFixed(2)} KB\n`);
  console.log('⏳ Executing migration via psql...\n');

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
      // Print NOTICE messages
      if (output.includes('NOTICE') || output.includes('CREATE')) {
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
        console.log('\n✅ Migration executed successfully!\n');
        console.log('🎉 Database migration completed!\n');
        resolve();
      } else {
        console.error('\n❌ Error executing migration');
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
        console.error('💡 Install PostgreSQL client:');
        console.error('   macOS: brew install postgresql');
        console.error('   Ubuntu: sudo apt-get install postgresql-client');
        console.error('   Windows: Download from https://www.postgresql.org/download/\n');
      } else {
        console.error('\n❌ Error spawning psql:');
        console.error(error);
      }
      reject(error);
    });
  });
}

// Get migration file from command line args
const migrationFile = process.argv[2];
runMigration(migrationFile).catch((error) => {
  console.error(error);
  process.exit(1);
});

