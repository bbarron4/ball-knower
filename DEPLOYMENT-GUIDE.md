# Ball Knower Deployment Guide

This guide will help you deploy your Ball Knower application to production with your `ballknower.app` domain.

## 🚀 Deployment Overview

We'll use:
- **Frontend**: Vercel (free, easy domain setup)
- **Backend**: Railway (free PostgreSQL + Node.js hosting)
- **Domain**: Your GoDaddy domain `ballknower.app`

## 📋 Prerequisites

1. GitHub account (free)
2. Vercel account (free)
3. Railway account (free)
4. Your domain `ballknower.app` from GoDaddy

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/ball-knower.git
git push -u origin main
```

### 1.2 Update Configuration
The following files have been created/updated for production:
- `config.js` - Environment-aware API configuration
- `vercel.json` - Vercel deployment configuration
- `backend/railway.json` - Railway deployment configuration
- `script.js` - Updated to use dynamic API URLs

## 🗄️ Step 2: Set Up Database (Railway)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Add PostgreSQL service
5. Copy the `DATABASE_URL` from the PostgreSQL service

## ⚙️ Step 3: Deploy Backend (Railway)

1. In Railway, add a new service
2. Choose "Deploy from GitHub repo"
3. Select your `ball-knower` repository
4. Set the root directory to `backend`
5. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=your-railway-postgres-url
   JWT_SECRET=generate-a-random-64-character-string
   JWT_EXPIRE=7d
   EMAIL_FROM=noreply@ballknower.app
   FRONTEND_URL=https://ballknower.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   TZ=America/New_York
   ```

6. Railway will automatically deploy your backend
7. Note the Railway URL (e.g., `https://ball-knower-backend-production.up.railway.app`)

## 🌐 Step 4: Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `ball-knower` repository
5. Configure:
   - Framework Preset: Other
   - Root Directory: `./` (root)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

6. Deploy!

## 🔗 Step 5: Connect Your Domain

### 5.1 In Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add `ballknower.app` and `www.ballknower.app`
4. Copy the DNS records Vercel provides

### 5.2 In GoDaddy:
1. Log into your GoDaddy account
2. Go to DNS management for `ballknower.app`
3. Update DNS records:
   - **A Record**: `@` → Vercel IP (from Vercel)
   - **CNAME**: `www` → `cname.vercel-dns.com`
   - **CNAME**: `api` → Your Railway backend URL

### 5.3 Update Backend CORS:
In Railway, update your environment variables:
```
FRONTEND_URL=https://ballknower.app
```

## 🧪 Step 6: Test Your Deployment

1. Visit `https://ballknower.app` - should show your app
2. Visit `https://ballknower.app/api/health` - should show backend health
3. Test user registration/login
4. Test trivia functionality

## 🔧 Step 7: Initialize Database

Run the database migration on Railway:
1. Go to Railway dashboard
2. Open your backend service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Go to "Logs" and run:
   ```bash
   npm run migrate
   ```

## 📧 Step 8: Set Up Email (Optional)

1. Sign up for [SendGrid](https://sendgrid.com) (free tier: 100 emails/day)
2. Create an API key
3. Add to Railway environment variables:
   ```
   SENDGRID_API_KEY=your-sendgrid-api-key
   ```

## 🎉 You're Live!

Your Ball Knower app should now be accessible at:
- **Main Site**: https://ballknower.app
- **API**: https://your-railway-backend-url.railway.app

## 🔍 Troubleshooting

### Frontend Issues:
- Check Vercel deployment logs
- Verify domain DNS propagation (can take 24-48 hours)
- Test with direct Vercel URL first

### Backend Issues:
- Check Railway deployment logs
- Verify database connection
- Test API endpoints directly

### Database Issues:
- Ensure DATABASE_URL is correct
- Run migrations: `npm run migrate`
- Check Railway PostgreSQL logs

## 📱 Next Steps

1. Set up SSL certificates (automatic with Vercel/Railway)
2. Configure custom email templates
3. Set up monitoring and analytics
4. Add admin dashboard
5. Set up automated backups

## 🆘 Support

If you run into issues:
1. Check the deployment logs in Vercel/Railway
2. Test locally first: `npm start` in backend, open `index.html`
3. Verify all environment variables are set correctly
4. Check DNS propagation status

Your Ball Knower app is now live! 🏀🏈
