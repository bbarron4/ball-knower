# 🚀 Ball Knower Weekly Challenge - Implementation Roadmap

## ✅ Completed (Phase 1 - Foundation)

### Backend Infrastructure
- ✅ Created Node.js/Express backend structure
- ✅ Set up PostgreSQL database schema (17 tables)
- ✅ Configured JWT authentication middleware
- ✅ Created package.json with all dependencies
- ✅ Added environment configuration template
- ✅ Set up database connection pooling
- ✅ Created comprehensive setup guide

### Frontend Components
- ✅ Created weekly challenge pop-up modal HTML
- ✅ Designed modal CSS with animations
- ✅ Built auth forms (login/register)
- ✅ Added team selection dropdown

## 📋 Next Steps (Continue Implementation)

### 1. Complete Backend API Routes (1-2 days)

**Priority Order:**
1. **Auth Routes** (`backend/src/routes/auth.js`)
   - POST /register - Create account
   - POST /login - Authenticate user
   - GET /me - Get current user
   - POST /logout - Clear session

2. **User Routes** (`backend/src/routes/users.js`)
   - GET /me - Get profile
   - PATCH /me - Update profile
   - GET /:id - Get user by ID

3. **Challenge Routes** (`backend/src/routes/challenges.js`)
   - GET /current - Get active challenge
   - GET /:id/games - Get games for challenge

4. **Pick Routes** (`backend/src/routes/picks.js`)
   - POST / - Submit pick
   - GET /my/:challengeId - Get my picks
   - POST /lock/:challengeId - Lock picks

5. **Trivia Routes** (`backend/src/routes/trivia.js`)
   - POST /:challengeId/start - Start trivia
   - POST /answer - Submit answer
   - GET /my-attempts - Get attempts

6. **Leaderboard Routes** (`backend/src/routes/leaderboards.js`)
   - GET /:challengeId/global - Global leaderboard
   - GET /:challengeId/trivia - Trivia leaderboard

### 2. Frontend Integration (2-3 days)

**Create `weekly-challenge.js`:**
```javascript
// API client
const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('ball_knower_token');

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  checkAuthAndShowModal();
});

async function checkAuthAndShowModal() {
  if (authToken) {
    // Check if user completed this week's challenge
    const completed = await checkWeeklyChallengeStatus();
    if (!completed) {
      showWeeklyChallengeModal();
    }
  } else {
    // Show modal for new/returning users
    setTimeout(() => showWeeklyChallengeModal(), 2000);
  }
}

function showWeeklyChallengeModal() {
  document.getElementById('weekly-challenge-modal').style.display = 'flex';
}

async function handleChallengeRegister(event) {
  event.preventDefault();
  // Call API, save token, show overview
}

async function handleChallengeLogin(event) {
  event.preventDefault();
  // Call API, save token, show overview
}
```

**Integrate into `index.html`:**
```html
<head>
  <!-- Add at end of head -->
  <link rel="stylesheet" href="weekly-challenge.css">
</head>
<body>
  <!-- Add before closing body tag -->
  <script src="weekly-challenge.js"></script>
</body>
```

### 3. Database Setup (30 minutes)

**Choose your hosting:**
- **Railway** (recommended): https://railway.app
- **Supabase**: https://supabase.com  
- **Neon**: https://neon.tech

**Steps:**
1. Create account
2. Create new Postgres database
3. Copy connection string
4. Run schema: `psql [connection-string] < backend/src/config/schema.sql`

### 4. Install & Start Backend (10 minutes)

```bash
cd backend
npm install

# Create .env file from template
# Add your DATABASE_URL and JWT_SECRET

# Start server
npm run dev
```

Server runs on `http://localhost:3001`

### 5. Testing Flow (1 day)

1. **Test Registration:**
   - Visit site → modal pops up
   - Create account with email/password
   - Verify JWT token stored
   - Verify user in database

2. **Test Challenge View:**
   - After auth, see overview step
   - Display user's picks/trivia status
   - Show leaderboard rank

3. **Test Picks:**
   - Click "Make Picks"
   - Select winners for each game
   - Set confidence ratings
   - Submit and lock

4. **Test Trivia:**
   - Click "Take Quiz"
   - 15-second timer per question
   - Submit answers
   - See results after Monday

5. **Test Leaderboard:**
   - View global standings
   - View trivia-only standings
   - Filter by week/season

### 6. Admin CMS (2-3 days)

Create admin interface to:
- Create weekly challenges
- Add games (5 per week)
- Add trivia questions (10 per week)
- Finalize game results
- Rebuild leaderboards

### 7. Email Notifications (1 day)

**Set up SendGrid:**
1. Create account (free 100 emails/day)
2. Get API key
3. Configure templates:
   - Weekly challenge open (Tuesday)
   - Last chance reminder (Saturday)
   - Results are in (Monday)

### 8. Cron Jobs (1 day)

**Schedule tasks:**
- Tuesday 12pm: Open new challenge, send emails
- Saturday 8pm: Send closing reminder
- Sunday 1pm: Lock challenge
- Monday 9am: Build leaderboards, send results

**Use:**
- node-cron
- GitHub Actions
- Vercel Cron (if deployed there)

### 9. Groups/Leagues (2 days)

- Create private leagues
- Generate invite codes
- Group-specific leaderboards
- Friend comparison

### 10. Polish & Deploy (2-3 days)

- Error handling
- Loading states
- Mobile optimization
- Deploy backend (Fly.io/Render)
- Deploy frontend (Vercel/Netlify)
- Set up monitoring

## 🎯 MVP Feature Checklist

**Week 1-2: Core Loop**
- [ ] User registration/login
- [ ] Weekly challenge creation
- [ ] Game picks with confidence
- [ ] Timed trivia (3 questions)
- [ ] Basic scoring
- [ ] Leaderboards (global + trivia)

**Week 3-4: Engagement**
- [ ] Email reminders
- [ ] Badges system
- [ ] Streak tracking
- [ ] User profiles
- [ ] Friends list

**Week 5-6: Social**
- [ ] Private groups/leagues
- [ ] Group leaderboards
- [ ] Invite system
- [ ] Share achievements

**Week 7-8: Polish**
- [ ] Admin CMS
- [ ] Analytics dashboard
- [ ] Mobile app (optional)
- [ ] Performance optimization

## 📊 Success Metrics

**Engagement:**
- 70%+ completion rate (picks + trivia)
- 50%+ week-over-week retention
- 3+ average picks per user
- 2+ average trivia attempts

**Growth:**
- 20%+ weekly user growth
- 30%+ invite accept rate
- 40%+ group participation

## 🐛 Known Challenges & Solutions

**Challenge:** Users forget to come back
**Solution:** Email + web push reminders Tuesday/Saturday/Monday

**Challenge:** Trivia timer cheating
**Solution:** Server-side validation, one-shot attempts

**Challenge:** Late picks after kickoff
**Solution:** Per-game locks enforced server-side

**Challenge:** Database scaling
**Solution:** Indexes on hot paths, materialized views for leaderboards

## 🆘 Need Help?

**Backend Issues:**
- Check `backend/SETUP.md`
- Verify `.env` configuration
- Test `/health` endpoint first

**Frontend Issues:**
- Check browser console
- Verify API_URL in `weekly-challenge.js`
- Test with Postman first

**Database Issues:**
- Check connection string
- Verify schema applied
- Check Postgres logs

## 📚 Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Express.js Guide: https://expressjs.com/
- JWT Best Practices: https://jwt.io/
- SendGrid Setup: https://docs.sendgrid.com/

## 🎉 Quick Win Path

**Want to see it working in 1 hour?**

1. Set up database (Railway - 5 min)
2. Install backend deps (5 min)
3. Configure .env (2 min)
4. Run migrations (1 min)
5. Start backend (1 min)
6. Add modal to index.html (2 min)
7. Test registration (5 min)
8. Create sample challenge via SQL (10 min)
9. Test full flow (20 min)

You'll have:
✅ Working registration/login
✅ Weekly challenge modal
✅ Database storing users
✅ JWT authentication
✅ Foundation for everything else

**Ready to continue?** Let me know which part you want to implement next!

