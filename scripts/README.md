# Database Seeding Scripts

These scripts help you run the Supabase seed SQL file without timeout issues.

## Prerequisites

Add the following to your `.env.local` file:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended for seeding
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For psql method (most reliable)
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
```

You can find these values in your Supabase project:
- Go to **Project Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_URL` is the "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the "anon public" key
- `SUPABASE_SERVICE_ROLE_KEY` is the "service_role" key (keep this secret!)
- `DATABASE_URL` is under **Project Settings** → **Database** → **Connection String** (Direct connection)

## Installation

Install the required dependency:

```bash
npm install dotenv --save-dev
```

## Usage

### Method 1: Using psql (Recommended for large files)

This method uses the PostgreSQL command-line client, which is the most reliable for large SQL files.

**Requirements**: PostgreSQL client (`psql`) must be installed:
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql-client`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

**Run the seed:**

```bash
npm run seed:psql
```

### Method 2: Using Supabase API

This method uses the Supabase JavaScript client. It may timeout on very large files.

**Run the seed:**

```bash
npm run seed
```

## Troubleshooting

### "psql: command not found"
Install the PostgreSQL client (see requirements above).

### "Missing database connection string"
Add `DATABASE_URL` to your `.env.local` file. Get it from:
1. Supabase Dashboard → Project Settings → Database
2. Under "Connection String", copy the "Direct connection" string
3. Replace `[YOUR-PASSWORD]` with your database password

### "Missing Supabase credentials"
Make sure your `.env.local` file has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)

### SQL Execution Errors
If you see UUID or syntax errors:
1. Check that all UUIDs in the seed file use valid hex characters (0-9, a-f)
2. Run migrations 001 and 002 before running the seed (003)

### Timeout Issues
For very large seed files:
1. Use the psql method (`npm run seed:psql`)
2. Or manually split the SQL file into smaller chunks
3. Or use Supabase CLI: `supabase db reset` (if using local development)

## What These Scripts Do

1. **run-seed-psql.js**: Executes the SQL file using the PostgreSQL `psql` command
   - Most reliable for large files
   - Shows real-time progress
   - Handles transactions properly

2. **run-seed.js**: Executes the SQL file via Supabase JavaScript client
   - No external dependencies needed
   - May timeout on very large files
   - Includes data verification after seeding

Both scripts:
- Load environment variables from `.env.local`
- Read the SQL file from `supabase/migrations/003_seed_data.sql`
- Execute the SQL against your Supabase database
- Show success/error messages
- Provide helpful troubleshooting tips

## Security Note

⚠️ **Never commit your `.env.local` file to version control!**

The `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` contain sensitive credentials that should never be shared publicly.


