# Maintenance Mode Documentation

## Overview

This project includes a professional, industrial-grade maintenance mode system that can be toggled on/off with environment variables.

## Features

✅ **Responsive Design** - Works perfectly on all devices
✅ **Dark Mode Support** - Automatically adapts to user's theme preference
✅ **Live Countdown Timer** - Shows estimated time until completion
✅ **Progress Bar** - Visual indicator of maintenance progress
✅ **Animated UI** - Smooth animations using Framer Motion
✅ **Health Check API** - Monitor system status programmatically
✅ **IP Whitelisting** - Allow specific IPs to bypass maintenance
✅ **Bypass Token** - Secret token for authorized access
✅ **SEO Optimized** - Proper meta tags and noindex during maintenance
✅ **Accessibility** - WCAG compliant with proper ARIA labels

## How to Enable Maintenance Mode

### Method 1: Branch-Based (Recommended for Vercel)

Simply push to or switch to the `maintenance-mode` branch in Vercel:

```bash
# Switch to maintenance branch
git checkout maintenance-mode

# Make any updates (optional)
git add .
git commit -m "Enable maintenance mode"

# Push to trigger Vercel deployment
git push origin maintenance-mode
```

Vercel will automatically deploy this branch and enable maintenance mode. No environment variables needed!

**To disable:** Switch back to your main branch in Vercel dashboard or push to main/production branch.

### Method 2: Environment Variable (Manual Override)

Add to your `.env.local` file or Vercel environment variables:

```bash
NEXT_PUBLIC_MAINTENANCE_MODE=true
MAINTENANCE_BYPASS_TOKEN=your-secret-token-123
MAINTENANCE_ALLOWED_IPS=127.0.0.1,::1,YOUR_IP_HERE
```

### Configure Estimated Completion Time

Edit `src/components/maintenance/MaintenancePage.tsx`:

```typescript
// Line 13 - Set your estimated completion time
const estimatedCompletion = new Date("2026-01-28T12:00:00");
```

### Deploy or Restart

- For production: Push to `maintenance-mode` branch
- For local: Set env var and restart your development server

## Bypassing Maintenance Mode

### Method 1: Using Bypass Token (URL)

```
https://yoursite.com?bypass=your-secret-token-123
```

### Method 2: IP Whitelisting

Add your IP to `MAINTENANCE_ALLOWED_IPS` in environment variables.

### Method 3: Cookie (Automatic after using bypass token)

Once you use the bypass token, a cookie is set for 24 hours.

## Health Check Endpoint

Monitor your site's status programmatically:

```bash
curl https://yoursite.com/api/health
```

Response:

```json
{
  "status": "maintenance",
  "timestamp": "2026-01-27T10:00:00.000Z",
  "maintenance": true
}
```

## Customization

### Update Contact Information

Edit `src/components/maintenance/MaintenancePage.tsx`:

```typescript
// Email link (line ~150)
<a href="mailto:your-email@example.com">

// Twitter/X link (line ~160)
<a href="https://twitter.com/yourusername">
```

### Change Colors

The page uses Tailwind CSS classes. Main colors:

- Primary: `blue-600` / `blue-400` (dark mode)
- Background: `gray-50` / `gray-950` (dark mode)
- Cards: `white` / `gray-800` (dark mode)

### Adjust Progress Simulation

Edit the progress calculation in `MaintenancePage.tsx` (line ~30):

```typescript
const totalTime = 24 * 60 * 60 * 1000; // Change 24 to your hours
```

## File Structure

```
src/
├── middleware.ts                          # Maintenance mode logic
├── app/
│   ├── maintenance/
│   │   └── page.tsx                      # Maintenance page route
│   └── api/
│       └── health/
│           └── route.ts                  # Health check endpoint
└── components/
    └── maintenance/
        └── MaintenancePage.tsx           # Main maintenance UI
```

## Testing Locally

1. Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` in `.env.local`
2. Restart dev server: `npm run dev` or `bun dev`
3. Visit `http://localhost:3000`
4. You should see the maintenance page

To bypass:

- Visit `http://localhost:3000?bypass=your-secret-token-123`

## Production Deployment

### Vercel (Branch-Based - Recommended)

**Enable Maintenance Mode:**

```bash
# Push to maintenance-mode branch
git checkout maintenance-mode
git push origin maintenance-mode
```

In Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Git" section
3. Set `maintenance-mode` branch as a deployment branch
4. Vercel will auto-deploy when you push to this branch

**Disable Maintenance Mode:**

- Switch production domain back to your main branch in Vercel dashboard
- Or merge changes back to main and deploy main branch

### Vercel (Environment Variable Method)

```bash
vercel env add NEXT_PUBLIC_MAINTENANCE_MODE
# Enter: true

vercel env add MAINTENANCE_BYPASS_TOKEN
# Enter: your-secret-token

vercel --prod
```

### Other Platforms

Set environment variables in your hosting platform's dashboard.

## Disabling Maintenance Mode

### Branch-Based (Vercel)

Switch your production deployment back to the main branch in Vercel dashboard.

### Environment Variable Method

Simply set:

```bash
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

Or remove the variable entirely, then redeploy.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Keep bypass token secret** - Don't commit it to version control
2. **Use strong tokens** - Generate with: `openssl rand -base64 32`
3. **Rotate tokens** - Change bypass token after maintenance
4. **HTTPS only** - Ensure cookies are secure in production
5. **IP validation** - Be careful with IP whitelisting behind proxies

## Troubleshooting

### Maintenance page not showing

- Check `NEXT_PUBLIC_MAINTENANCE_MODE` is set to `"true"` (string)
- Verify middleware is running (check `src/middleware.ts`)
- Clear browser cache and cookies

### Bypass not working

- Verify token matches exactly (case-sensitive)
- Check cookie is being set (browser dev tools)
- Ensure HTTPS in production for secure cookies

### Countdown not accurate

- Update `estimatedCompletion` date in `MaintenancePage.tsx`
- Check timezone settings

## Support

For issues or questions, contact:

- Email: contact@satyamsharma.tech
- Twitter/X: @satyamsharma

---

**Last Updated:** January 27, 2026
