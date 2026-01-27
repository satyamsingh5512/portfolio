# Vercel Branch-Based Maintenance Mode Setup

## Quick Setup Guide

### 1. Configure Vercel Project

In your Vercel Dashboard:

1. Go to **Project Settings** → **Git**
2. Under "Production Branch", keep your main branch (e.g., `main` or `master`)
3. Under "Deploy Hooks", you can optionally create a deploy hook for the maintenance branch

### 2. Set Up Branch Deployments

Vercel automatically deploys all branches. The `maintenance-mode` branch will:

- Auto-deploy when you push to it
- Be accessible at: `maintenance-mode-yourproject.vercel.app`
- Automatically enable maintenance mode (no env vars needed!)

### 3. Enable Maintenance Mode

**Option A: Switch Production to Maintenance Branch**

1. Push to maintenance-mode branch:

   ```bash
   git checkout maintenance-mode
   git push origin maintenance-mode
   ```

2. In Vercel Dashboard:
   - Go to **Deployments**
   - Find the `maintenance-mode` deployment
   - Click the three dots (⋯) → **Promote to Production**

Your site is now in maintenance mode! 🚧

**Option B: Use Custom Domain for Maintenance**

1. Add a custom domain in Vercel (e.g., `maintenance.yoursite.com`)
2. Point it to the `maintenance-mode` branch deployment
3. When needed, update your main domain DNS to point to maintenance domain

### 4. Disable Maintenance Mode

**To go back to normal:**

1. In Vercel Dashboard → **Deployments**
2. Find your latest `main` branch deployment
3. Click three dots (⋯) → **Promote to Production**

Or simply push a new commit to your main branch.

## How It Works

The middleware checks for the Vercel environment variable:

```typescript
const MAINTENANCE_MODE =
  process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
  process.env.VERCEL_GIT_COMMIT_REF === "maintenance-mode";
```

When deployed on the `maintenance-mode` branch:

- `VERCEL_GIT_COMMIT_REF` automatically equals `'maintenance-mode'`
- Maintenance mode activates automatically
- No manual environment variable configuration needed!

## Workflow Example

### Scenario: Scheduled Maintenance

**Before Maintenance:**

```bash
# 1. Update completion time in MaintenancePage.tsx
git checkout maintenance-mode
# Edit src/components/maintenance/MaintenancePage.tsx
# Update: const estimatedCompletion = new Date('2026-01-28T12:00:00');

git add .
git commit -m "Update maintenance completion time"
git push origin maintenance-mode

# 2. In Vercel: Promote maintenance-mode deployment to production
```

**During Maintenance:**

- Users see the maintenance page
- You can bypass with: `?bypass=your-secret-token`
- Health check API shows: `{"status": "maintenance"}`

**After Maintenance:**

```bash
# 1. Merge any fixes to main
git checkout main
git merge maintenance-mode  # If you made fixes
git push origin main

# 2. In Vercel: Promote main deployment to production
```

## Testing Locally

To test maintenance mode locally:

```bash
# Option 1: Use environment variable
echo "NEXT_PUBLIC_MAINTENANCE_MODE=true" >> .env.local
npm run dev

# Option 2: Simulate Vercel branch
echo "VERCEL_GIT_COMMIT_REF=maintenance-mode" >> .env.local
npm run dev
```

## Preview Deployments

Every branch gets a preview URL:

- Main branch: `yourproject.vercel.app` (production)
- Maintenance branch: `maintenance-mode-yourproject.vercel.app`

You can test the maintenance page at the preview URL before promoting to production!

## Advanced: Automated Switching

### Using Vercel Deploy Hooks

1. Create a deploy hook for `maintenance-mode` branch in Vercel
2. Create a deploy hook for `main` branch
3. Use these hooks in your CI/CD or monitoring system

```bash
# Enable maintenance (triggers maintenance-mode deployment)
curl -X POST https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID

# Disable maintenance (triggers main deployment)
curl -X POST https://api.vercel.com/v1/integrations/deploy/YOUR_MAIN_HOOK_ID
```

### Using Vercel API

For programmatic control, use the Vercel API to promote deployments:

```bash
# Get deployment ID
curl "https://api.vercel.com/v6/deployments?projectId=YOUR_PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Promote to production
curl -X PATCH "https://api.vercel.com/v13/deployments/DEPLOYMENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "production"}'
```

## Troubleshooting

### Maintenance mode not activating

- Check deployment logs in Vercel
- Verify branch name is exactly `maintenance-mode`
- Check middleware.ts is included in deployment

### Can't bypass maintenance

- Verify bypass token in environment variables
- Check browser cookies (may need to clear)
- Try incognito/private browsing

### Wrong branch in production

- Check Vercel Dashboard → Deployments → Production
- Promote the correct deployment

## Security Notes

🔒 **Important:**

- Keep bypass tokens in Vercel environment variables (not in code)
- Use different tokens for preview and production
- Rotate tokens after maintenance
- Consider IP whitelisting for admin access

## Support

Questions? Check:

- Main docs: `MAINTENANCE_MODE.md`
- Vercel docs: https://vercel.com/docs/deployments/git
- Project issues: GitHub Issues

---

**Last Updated:** January 27, 2026
