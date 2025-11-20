# Namecheap API Integration

## Overview

This implementation integrates Namecheap's sandbox API to enable domain search, availability checking, and test purchases through a modern two-tab interface in the domains section.

## Features Implemented

### 1. Backend Infrastructure

#### Namecheap API Client (`lib/namecheap/client.ts`)
- **Domain Availability Checking**: Check multiple domains at once
- **Domain Pricing**: Get real-time pricing for different TLDs
- **Domain Purchase**: Register domains through Namecheap sandbox
- **XML Response Parsing**: Custom parser for Namecheap's XML API responses
- **Error Handling**: Comprehensive error handling with fallback mechanisms

#### API Routes

**`/api/domains/search` (POST)**
- Accepts array of domains to check
- Validates domain format
- Returns availability status and pricing
- Falls back to mock data if API fails (for demo purposes)

**`/api/domains/purchase` (POST)**
- Validates domain availability before purchase
- Processes purchase through Namecheap sandbox
- Stores domain in local database
- Returns order confirmation details

### 2. Frontend UI

#### Two-Tab Interface
1. **My Domains Tab**
   - View all owned domains
   - Domain statistics (Total, Active, Clicks, Links)
   - Full domain management table
   - Connect existing domain functionality

2. **Buy Domains Tab**
   - Domain search with custom name input
   - Multiple TLD selection (.com, .net, .org, .io, .co, .xyz, .app, .dev, .ai)
   - Real-time availability checking
   - Price display for available domains
   - One-click purchase flow

#### Purchase Flow
1. Enter domain name (without extension)
2. Select TLDs to check
3. View search results with availability and pricing
4. Click "Purchase" on available domain
5. Review order in confirmation modal
6. Complete purchase (sandbox mode)
7. Domain automatically added to "My Domains"

### 3. Database Schema Updates

New fields added to `domains` table:
- `purchase_source` - Track where domain was acquired (namecheap, manual, etc.)
- `namecheap_order_id` - Store Namecheap order reference
- `auto_renew` - Flag for auto-renewal status

Migration file: `supabase/migrations/008_add_namecheap_fields.sql`

## Setup Instructions

### 1. Environment Variables

⚠️ **IMPORTANT**: You must replace the placeholder values with your ACTUAL Namecheap credentials!

Add the following to your `.env.local` file:

```env
# Namecheap API Configuration (Sandbox)
NAMECHEAP_USERNAME=your_actual_namecheap_username
NAMECHEAP_API_USER=your_actual_namecheap_username
NAMECHEAP_API_KEY=your_actual_api_key_from_namecheap
NAMECHEAP_CLIENT_IP=your_actual_ip_address
NAMECHEAP_SANDBOX=true
```

**Note**: `NAMECHEAP_USERNAME` and `NAMECHEAP_API_USER` are usually the SAME value (your Namecheap login username).

📖 For detailed setup instructions, see [NAMECHEAP_SETUP_GUIDE.md](./NAMECHEAP_SETUP_GUIDE.md)

### 2. Get Namecheap Sandbox Credentials

1. Create a Namecheap account at https://www.namecheap.com/
2. Go to Profile > Tools > Business & Dev Tools
3. Enable API Access and get your credentials
4. Whitelist your IP address
5. Use sandbox endpoint: `https://api.sandbox.namecheap.com/xml.response`

### 3. Run Database Migration

```bash
# Apply the new migration to add Namecheap fields
npm run seed
```

### 4. Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to Dashboard > Domains
3. Click "Buy Domains" tab
4. Search for a domain (e.g., "myawesomesite")
5. Select TLDs to check
6. Purchase an available domain

## Technical Details

### API Endpoints

**Namecheap Sandbox**: `https://api.sandbox.namecheap.com/xml.response`

**Commands Used**:
- `namecheap.domains.check` - Check domain availability
- `namecheap.domains.create` - Purchase/register domain

### Pricing

The implementation includes mock pricing for common TLDs:
- .com - $8.88/year
- .net - $10.98/year
- .org - $12.98/year
- .io - $39.98/year
- .co - $32.98/year
- .xyz - $1.99/year
- .app - $14.98/year
- .dev - $12.98/year
- .ai - $89.98/year

### Mock/Demo Features

When API is not configured or fails, the system:
- Uses mock availability data (70% available)
- Shows estimated pricing based on TLD
- Simulates successful purchases for demo purposes

This ensures the UI is fully functional even without API credentials.

## Components Structure

```
app/
├── api/
│   └── domains/
│       ├── search/route.ts          # Domain search endpoint
│       └── purchase/route.ts        # Domain purchase endpoint
├── dashboard/
│   └── domains/
│       └── page.tsx                 # Main domains page with tabs
lib/
└── namecheap/
    └── client.ts                    # Namecheap API client
supabase/
└── migrations/
    └── 008_add_namecheap_fields.sql # Database schema update
types/
└── database.ts                      # Updated TypeScript types
```

## Features Highlights

### User Experience
- ✅ Intuitive two-tab interface
- ✅ Multi-TLD search capability
- ✅ Real-time availability checking
- ✅ Clear pricing display
- ✅ One-click purchase flow
- ✅ Confirmation modal with order details
- ✅ Automatic domain addition to account

### Developer Experience
- ✅ Type-safe API client
- ✅ Comprehensive error handling
- ✅ Fallback to mock data
- ✅ Sandbox environment for testing
- ✅ Clean separation of concerns
- ✅ Well-documented code

### Security
- ✅ Server-side API calls only
- ✅ Domain format validation
- ✅ Duplicate domain checking
- ✅ Environment variable configuration
- ✅ No client-side API key exposure

## Testing

### Sandbox Mode
All purchases use Namecheap's sandbox environment:
- No real charges are made
- Test domain registrations
- Order IDs are generated for testing
- Full API functionality available

### Test Flow
1. Search for domain: "testdomain123"
2. Select .com TLD
3. Verify availability shows correctly
4. Click "Purchase"
5. Review order details
6. Confirm purchase
7. Check domain appears in "My Domains" tab

## Future Enhancements

Potential additions for production:
- Domain transfer functionality
- DNS management interface
- SSL certificate automation
- Domain renewal reminders
- Bulk domain operations
- Advanced search filters
- Price comparison across registrars
- Real payment integration
- Domain portfolio analytics

## Support

For issues or questions:
- Check Namecheap API documentation: https://www.namecheap.com/support/api/
- Review sandbox setup guide
- Verify environment variables are set correctly
- Check IP whitelist configuration

## Notes

- This is a **sandbox/mockup implementation**
- Uses Namecheap's test environment
- No real purchases or charges occur
- Perfect for testing and development
- Ready for production with real API credentials

