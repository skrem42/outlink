# Namecheap API Setup Guide

## Environment Variables Explained

Your `.env.local` file should contain these variables with **actual values** (not placeholders):

```env
# Your Namecheap account username (the one you use to login)
NAMECHEAP_USERNAME=johndoe

# API username - usually THE SAME as your regular username
NAMECHEAP_API_USER=johndoe

# Your API key from Namecheap (long alphanumeric string)
NAMECHEAP_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Your current public IP address (must be whitelisted)
NAMECHEAP_CLIENT_IP=123.456.789.012

# Use sandbox mode for testing (no real charges)
NAMECHEAP_SANDBOX=true
```

## Understanding the Variables

### 1. NAMECHEAP_USERNAME vs NAMECHEAP_API_USER

**They are usually the SAME value!**

- **NAMECHEAP_USERNAME**: Your Namecheap account username (what you use to log in)
- **NAMECHEAP_API_USER**: The username for API authentication (typically the same as above)

**Example**: If your Namecheap login is `johndoe`, both should be `johndoe`.

### 2. Why Do We Need Both?

Namecheap's API design requires both parameters:
- `UserName`: For account identification
- `ApiUser`: For API access control

In most cases, they're identical. Only enterprise accounts might have different values.

## Step-by-Step Setup

### Step 1: Create Namecheap Account
1. Go to [Namecheap.com](https://www.namecheap.com)
2. Sign up for a free account
3. Remember your username (you'll need it for the env variables)

### Step 2: Enable API Access
1. Log into Namecheap
2. Click your profile name in top right
3. Navigate to: **Profile** → **Tools** → **Business & Dev Tools**
4. Under "Namecheap API Access", click **Manage**
5. Toggle API Access to **ON**

### Step 3: Get Your API Key
1. In the API Access section, you'll see your API key
2. Copy this key (it's a long alphanumeric string)
3. This is your `NAMECHEAP_API_KEY`

### Step 4: Whitelist Your IP Address
1. Find your public IP: Visit [WhatIsMyIP.com](https://www.whatismyip.com/)
2. In Namecheap API settings, add your IP to the whitelist
3. Click "Add" and enter your IP address
4. This is your `NAMECHEAP_CLIENT_IP`

⚠️ **Important**: If your IP changes (e.g., VPN, different network), you must update the whitelist!

### Step 5: Use Sandbox Mode (Recommended for Testing)
1. For the sandbox, use the sandbox API endpoint
2. Set `NAMECHEAP_SANDBOX=true` in your `.env.local`
3. Sandbox allows testing without real purchases or charges

### Step 6: Update Your .env.local

Create or edit `/herouiprotest/.env.local`:

```env
# Replace these with YOUR actual values
NAMECHEAP_USERNAME=your_actual_username
NAMECHEAP_API_USER=your_actual_username
NAMECHEAP_API_KEY=your_actual_api_key_from_namecheap
NAMECHEAP_CLIENT_IP=your.actual.ip.address
NAMECHEAP_SANDBOX=true
```

## Example Configuration

Here's what a REAL configuration looks like (with fake values for illustration):

```env
# ✅ CORRECT - with actual values
NAMECHEAP_USERNAME=johnsmith2024
NAMECHEAP_API_USER=johnsmith2024
NAMECHEAP_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
NAMECHEAP_CLIENT_IP=192.168.1.100
NAMECHEAP_SANDBOX=true
```

```env
# ❌ INCORRECT - with placeholder values (what you currently have)
NAMECHEAP_USERNAME=your_username
NAMECHEAP_API_USER=your_api_username
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_CLIENT_IP=your_whitelisted_ip
NAMECHEAP_SANDBOX=true
```

## Common Issues & Solutions

### Issue 1: "Parameter RegistrantFirstName is Missing"
**Fixed!** ✅ This has been corrected in the latest code update.

### Issue 2: "API Key is invalid"
- Make sure you copied the full API key
- Check for extra spaces or line breaks
- Verify API access is enabled in Namecheap

### Issue 3: "IP address not whitelisted"
- Your IP must be added to Namecheap's whitelist
- Check your current IP at WhatIsMyIP.com
- Add it to the whitelist in Namecheap dashboard
- Wait a few minutes for changes to take effect

### Issue 4: "Authentication failed"
- Verify `NAMECHEAP_API_USER` matches your username
- Verify `NAMECHEAP_USERNAME` matches your username
- Both should typically be the same

## Testing Your Setup

After configuring, test it:

1. Start your dev server: `npm run dev`
2. Navigate to: **Dashboard** → **Domains**
3. Click the **"Buy Domains"** tab
4. Search for a domain (e.g., "test123")
5. Try to purchase an available domain

If configured correctly, you should see:
- ✅ Real availability results from Namecheap
- ✅ Actual pricing data
- ✅ Successful test purchase

## Sandbox vs Production

### Sandbox Mode (Testing) - Current Setup
- Use: `NAMECHEAP_SANDBOX=true`
- Endpoint: `api.sandbox.namecheap.com`
- No real charges
- Test domain registrations
- Perfect for development

### Production Mode (Real Purchases)
- Use: `NAMECHEAP_SANDBOX=false`
- Endpoint: `api.namecheap.com`
- Real money transactions
- Actual domain registrations
- Only use when ready for production

## Need Help?

1. **Namecheap API Docs**: https://www.namecheap.com/support/api/
2. **API Access Guide**: https://www.namecheap.com/support/api/intro/
3. **Sandbox Testing**: https://www.namecheap.com/support/api/sandbox/

## Quick Checklist

Before testing, verify:
- [ ] Created Namecheap account
- [ ] Enabled API access in dashboard
- [ ] Copied API key correctly
- [ ] Added current IP to whitelist
- [ ] Updated `.env.local` with actual values (not placeholders)
- [ ] Set `NAMECHEAP_SANDBOX=true`
- [ ] Restarted dev server after changing .env

## What You Currently Have

Based on your screenshot, your `.env.local` has **placeholder values**:
```env
NAMECHEAP_API_USER=your_api_username
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_USERNAME=your_username
NAMECHEAP_CLIENT_IP=your_whitelisted_ip
```

You need to **replace these with your actual Namecheap credentials**!

Example of what it should look like:
```env
NAMECHEAP_API_USER=johnsmith2024
NAMECHEAP_API_KEY=f8e7d6c5b4a3928172635aef...
NAMECHEAP_USERNAME=johnsmith2024
NAMECHEAP_CLIENT_IP=98.123.45.67
```

