# Ball Knower Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Database

#### Option A: Railway (Recommended - Free)
1. Go to https://railway.app
2. Sign up and create new project
3. Add PostgreSQL service
4. Copy the `DATABASE_URL` from Railway dashboard

#### Option B: Supabase (Free)
1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings > Database
4. Copy the connection string

#### Option C: Neon (Free)
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string

### 3. Configure Environment
1. Copy `env-template.txt` to `.env`
2. Update `DATABASE_URL` with your Postgres connection string
3. Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
4. Update other environment variables as needed

### 4. Initialize Database
```bash
# This will create all tables
node src/utils/migrate.js
```

### 5. Seed Sample Data (Optional)
```bash
# This will add sample challenges and questions
node src/utils/seed.js
```

### 6. Start Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Main application entry
├── package.json
└── .env                 # Environment variables (create this)
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID

### Challenges
- `GET /api/challenges/current` - Get current weekly challenge
- `GET /api/challenges/:id` - Get challenge details
- `GET /api/challenges/:id/games` - Get games for challenge

### Picks
- `POST /api/picks` - Submit a pick
- `GET /api/picks/my/:challengeId` - Get my picks for challenge
- `POST /api/picks/lock/:challengeId` - Lock all picks

### Trivia
- `POST /api/trivia/:challengeId/start` - Start trivia session
- `POST /api/trivia/:challengeId/answer` - Submit answer
- `GET /api/trivia/:challengeId/my-attempts` - Get my attempts

### Leaderboards
- `GET /api/leaderboards/:challengeId/global` - Global leaderboard
- `GET /api/leaderboards/:challengeId/trivia` - Trivia-only leaderboard
- `GET /api/leaderboards/:challengeId/groups/:groupId` - Group leaderboard

### Groups
- `POST /api/groups` - Create group
- `POST /api/groups/join` - Join group
- `GET /api/groups/:id` - Get group details
- `GET /api/groups/:id/members` - Get members

### Admin (Protected)
- `POST /api/admin/challenges` - Create challenge
- `POST /api/admin/games` - Add game
- `POST /api/admin/trivia` - Add trivia question
- `POST /api/admin/finalize/:gameId` - Finalize game result

## 🔐 Authentication Flow

1. User registers with email + password
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Include token in Authorization header: `Bearer <token>`
5. Token expires after 7 days

## 📧 Email Setup (SendGrid)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key
3. Add to `.env` as `SENDGRID_API_KEY`
4. Configure sender email in `EMAIL_FROM`

## 🧪 Testing

Test the API with:
- Postman (import collection from `/backend/postman/`)
- cURL
- Frontend integration

Example:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'
```

## 🐛 Troubleshooting

### Database Connection Errors
- Verify DATABASE_URL is correct
- Check if Postgres service is running
- Ensure IP is whitelisted (for cloud databases)

### Port Already in Use
- Change PORT in `.env`
- Kill existing process: `lsof -ti:3001 | xargs kill -9` (Mac/Linux)

### JWT Errors
- Regenerate JWT_SECRET
- Clear frontend localStorage
- Check token expiration

## 📚 Next Steps

1. Set up frontend integration (see `/frontend/INTEGRATION.md`)
2. Configure email templates
3. Set up cron jobs for weekly challenge automation
4. Enable web push notifications
5. Add admin dashboard

## 🆘 Support

For issues or questions, check:
- Backend logs in console
- Database logs in your hosting provider
- Network tab in browser dev tools

