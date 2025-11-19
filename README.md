# Outlink Next - Link in Bio Platform

A modern link-in-bio platform with custom domain support, analytics, and multi-creator management.

## Features

- 🔗 **Custom Domains** - Use your own domain instead of generic bio links
- 📊 **Analytics Dashboard** - Track clicks, views, and conversions
- 👥 **Multi-Creator Support** - Manage links for multiple creators
- 🎨 **Modern UI** - Built with Hero UI Pro components
- 🔒 **Multiple Link Types** - Whitehat, Greyhat, and Blackhat link options
- 📱 **Responsive Design** - Works beautifully on all devices

## Tech Stack

- **Framework**: Next.js 15.5 (App Router, Turbopack)
- **UI Library**: Hero UI Pro + NextUI
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Iconify
- **Charts**: Recharts
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- A Supabase account (free tier works fine)

### Installation

1. **Clone the repository**
   ```bash
   cd herouiprotest
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Supabase** (IMPORTANT!)
   
   Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   
   Quick summary:
   - Create a Supabase project
   - Run the migration SQL
   - Add your API keys to `.env.local`
   - Seed sample data (optional)

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
herouiprotest/
├── app/
│   ├── api/              # API routes
│   │   ├── analytics/    # Analytics endpoints
│   │   ├── auth/         # Mock auth
│   │   ├── creators/     # Creators CRUD
│   │   ├── domains/      # Domains CRUD
│   │   └── links/        # Links CRUD
│   ├── dashboard/        # Dashboard pages
│   │   ├── analytics/    # Analytics page
│   │   ├── creators/     # Creators management
│   │   ├── domains/      # Domains management
│   │   └── links/        # Links management
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── sidebar.tsx       # Sidebar navigation
│   ├── new-link-drawer.tsx     # Link creation form
│   ├── link-success-screen.tsx # Success screen
│   ├── chart-card.tsx    # KPI cards
│   └── analytics-chart.tsx     # Analytics graphs
├── lib/
│   ├── supabase/         # Supabase client config
│   ├── api-client.ts     # API helper functions
│   └── utils.ts          # Utility functions
├── types/
│   └── database.ts       # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
└── config/
    └── site.ts           # Site configuration
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts (mock for now)
- **creators** - Content creators managed by users
- **domains** - Custom domains (default + user-owned)
- **links** - Bio links with custom paths
- **analytics_events** - Click/view/conversion tracking

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## API Routes

### Links
- `GET /api/links` - Get all links
- `POST /api/links` - Create a link
- `GET /api/links/[id]` - Get single link
- `PATCH /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link

### Creators
- `GET /api/creators` - Get all creators
- `POST /api/creators` - Create a creator
- `GET /api/creators/[id]` - Get single creator
- `PATCH /api/creators/[id]` - Update creator
- `DELETE /api/creators/[id]` - Delete creator

### Domains
- `GET /api/domains` - Get all domains
- `POST /api/domains` - Register a domain
- `GET /api/domains/[id]` - Get single domain
- `PATCH /api/domains/[id]` - Update domain
- `DELETE /api/domains/[id]` - Delete domain

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/track` - Track an event

### Auth (Mock)
- `GET /api/auth/session` - Get current session

## Link Types

1. **Whitehat** - Full landing page with content (Linktree-style)
2. **Greyhat** - Age-gated landing page with verification
3. **Blackhat** - Direct link (bypasses landing page)

## Development Notes

### Mock Authentication

Currently using a mock user ID (`00000000-0000-0000-0000-000000000000`). All API requests use this ID. Real authentication will be added later.

### Default Domains

The following domains are always available:
- outlink.bio
- clickfor.bio
- clickfor.links
- tapfor.links

Users can also add custom domains through the Domains page.

### Environment Variables

Required variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MOCK_USER_ID=00000000-0000-0000-0000-000000000000
```

## Roadmap

- [ ] Complete analytics page integration
- [ ] Complete creators page integration  
- [ ] Complete domains page integration
- [ ] Complete dashboard home integration
- [ ] Real authentication (Supabase Auth)
- [ ] Email notifications
- [ ] QR code generation
- [ ] Custom link themes
- [ ] A/B testing
- [ ] Team collaboration
- [ ] Namecheap API integration for domain registration

## Troubleshooting

If you encounter errors:

1. **"Internal server error" when loading links**
   - Make sure Supabase is set up (see SUPABASE_SETUP.md)
   - Check `.env.local` has correct API keys
   - Restart dev server after changing `.env.local`

2. **Empty pages with no data**
   - Run the seed data SQL (see SUPABASE_SETUP.md Step 6)

3. **TypeScript errors**
   - Run `pnpm install` to ensure all types are installed

4. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `pnpm install`

## Contributing

This is an MVP in active development. Contributions welcome!

## License

MIT
