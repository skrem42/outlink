# 🌱 Quick Start: Seeding Your Database

Your seed SQL file has been fixed (UUIDs corrected) and seeding scripts have been created!

## 🚀 Quick Steps

### 1. Install Dependencies

```bash
npm install dotenv --save-dev
```

### 2. Add Database Credentials

Add these to your `.env.local` file:

```bash
# Get from: Supabase Dashboard → Settings → Database → Connection String
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Run the Seed

**Option A: Using psql (Recommended - Most Reliable)**

```bash
npm run seed:psql
```

Requirements: Install PostgreSQL client if needed:
- macOS: `brew install postgresql`
- Ubuntu: `sudo apt-get install postgresql-client`

**Option B: Using Supabase API**

```bash
npm run seed
```

No external dependencies, but may timeout on large files.

## 📝 What Was Fixed

The original error was caused by invalid UUIDs in the seed file:
- ❌ `'l1111111-1111-1111-1111-111111111111'` (letter 'l' is not valid hex)
- ✅ `'a1111111-1111-1111-1111-111111111111'` (letter 'a' is valid hex)

All link IDs have been corrected from `'l'` prefix to `'a'` prefix.

## 📚 Files Created

- `scripts/run-seed.js` - Seed via Supabase API
- `scripts/run-seed-psql.js` - Seed via PostgreSQL client (most reliable)
- `scripts/README.md` - Detailed documentation

## 🆘 Troubleshooting

### Can't find DATABASE_URL?

1. Go to Supabase Dashboard
2. Click **Project Settings** → **Database**
3. Under "Connection String", find **Direct connection**
4. Copy it (format: `postgresql://postgres:...`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Still getting UUID errors?

The seed file has been fixed. If you still see errors, make sure you're using the updated `003_seed_data.sql` file.

### Timeout in Supabase SQL Editor?

That's why these scripts exist! Use `npm run seed:psql` instead - it handles large files perfectly.

---

**Need more details?** Check `scripts/README.md` for comprehensive documentation.


