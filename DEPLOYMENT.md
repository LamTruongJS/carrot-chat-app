# 🚀 Deployment Guide - Carrot Chat App

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and it's **FREE** for personal projects.

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to GitHub

### Step 1: Prepare Your Repository

Make sure your code is on GitHub **WITHOUT** the `.env.local` file:

```bash
# Check what will be committed
git status

# Make sure .env.local is NOT listed
# If it is, make sure it's in .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Carrot Chat App"

# Push to GitHub
git push origin main
```

⚠️ **DOUBLE CHECK**: Never push `.env.local` to GitHub!

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `carrot-chat-app` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables

This is the **MOST IMPORTANT** step:

1. In the Vercel project setup, find **"Environment Variables"**
2. Add a new variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `key` (get from console.anthropic.com)
   - **Environment**: All (Production, Preview, Development)
3. Click **"Add"**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. You'll see: ✅ **"Deployment Ready"**
4. Click **"Visit"** to open your live app!

### Step 5: Verify Deployment

Your app should be live at: `https://your-app-name.vercel.app`

Test it:
1. Open the URL
2. Try sending a message
3. Verify you get a response from Claude AI

---

## Deploying to Netlify

### Step 1: Prepare Build

Create `netlify.toml` in your root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import existing project"**
3. Connect to GitHub and select your repo
4. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your API key
5. Click **"Deploy"**

---

## Deploying to Railway

### Step 1: Install Railway CLI (Optional)

```bash
npm install -g @railway/cli
```

### Step 2: Deploy

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Choose your repository
5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your API key
6. Railway will auto-deploy

---

## Deploying to Self-Hosted Server

### Using PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "carrot-chat" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  carrot-chat:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped
```

Deploy:

```bash
# Build
docker-compose build

# Run
docker-compose up -d
```

---

## Environment Variables Setup by Platform

### Vercel
```
Dashboard → Settings → Environment Variables
```

### Netlify
```
Site Settings → Environment Variables → Add a variable
```

### Railway
```
Project → Variables → New Variable
```

### Heroku
```bash
heroku config:set ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

### AWS Amplify
```
App Settings → Environment Variables → Manage Variables
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads successfully
- [ ] Theme toggle works
- [ ] Can send messages
- [ ] Receives AI responses
- [ ] Chat history saves
- [ ] Dark mode persists
- [ ] Copy message works
- [ ] Clear chat works
- [ ] Mobile responsive
- [ ] No console errors

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `chat.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### Netlify

1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records:
   - **A Record**: `75.2.60.5`
   - **AAAA Record**: `2606:4700:3034::6815:b47`
4. Wait for SSL certificate (automatic)

---

## Monitoring and Analytics

### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Add Google Analytics

```bash
npm install @next/third-parties
```

In `app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## Troubleshooting Deployment Issues

### Build Failed

**Check build logs for errors:**

```bash
npm run build
```

Common issues:
- TypeScript errors
- Missing dependencies
- Environment variables not set

### API Not Working

**Verify environment variables:**

1. Check they're set correctly in hosting platform
2. Restart deployment after adding variables
3. Check API key is valid

### 500 Internal Server Error

**Check server logs:**

- Vercel: Functions → Logs
- Netlify: Functions → Logs
- Railway: Deployment → Logs

Common causes:
- Missing `ANTHROPIC_API_KEY`
- Invalid API key
- API rate limits

### Styles Not Loading

**Make sure:**

1. `globals.css` is imported in `layout.tsx`
2. Tailwind config includes all paths
3. Build succeeded without errors

---

## Performance Optimization

### Enable Caching

In `next.config.mjs`:

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};
```

### Add Sentry for Error Tracking

```bash
npm install @sentry/nextjs
```

### Enable Edge Runtime

In `app/api/chat/route.ts`:

```typescript
export const runtime = 'edge';
```

---

## Scaling

### Handle High Traffic

1. **Use Edge Functions** - Deploy API routes to edge locations
2. **Add Rate Limiting** - Prevent abuse (already included)
3. **Implement Caching** - Cache static assets
4. **Use CDN** - Vercel includes this automatically

### Database for Chat History

If localStorage isn't enough, add:
- **Supabase** (PostgreSQL + Auth)
- **MongoDB Atlas**
- **PlanetScale** (MySQL)
- **Redis** (for sessions)

---

## Security Best Practices

### Production Checklist

- [ ] API keys in environment variables only
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] CSP headers set
- [ ] No console.log in production
- [ ] Error messages don't expose sensitive info

### Add Security Headers

In `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## Cost Estimation

### Anthropic Claude API

- Free tier: Check current rates at [anthropic.com/pricing](https://www.anthropic.com/pricing)
- Estimated: $0.003 - $0.015 per message (depending on length)
- 100 messages ≈ $0.30 - $1.50

### Hosting (Vercel)

- **Hobby Plan**: FREE
  - Unlimited websites
  - 100GB bandwidth/month
  - Serverless functions included

- **Pro Plan**: $20/month
  - More bandwidth
  - More function execution time

### Total Monthly Cost

- **Personal use**: FREE (Vercel Hobby + Anthropic free tier)
- **Small business**: ~$20-50/month
- **High traffic**: ~$50-200/month

---

## Backup and Maintenance

### Backup Deployment

```bash
# Export from Vercel
vercel pull

# Create backup branch
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test
npm run build
npm run dev
```

---

## Support

Need help with deployment?

- [Vercel Discord](https://vercel.com/discord)
- [Anthropic Support](https://support.anthropic.com/)
- [Next.js GitHub](https://github.com/vercel/next.js/discussions)

---

**You're all set! 🚀 Your Carrot Chat App is now live!**

