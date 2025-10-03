import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Test email endpoint
router.post('/test-email', authenticate, async (req, res) => {
    try {
        const { user_id } = req.body;
        
        // Get user details
        const userResult = await query(
            'SELECT id, username, email, favorite_team FROM users WHERE id = $1',
            [user_id || req.user.id]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = userResult.rows[0];
        
        // Get current challenge
        const challengeResult = await query(
            'SELECT id, week_number, season, opens_at, locks_at FROM weekly_challenges WHERE status = $1 ORDER BY opens_at DESC LIMIT 1',
            ['open']
        );
        
        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No active challenge found' });
        }
        
        const challenge = challengeResult.rows[0];
        
        // Send test email
        const emailResult = await emailService.sendWeeklyChallengeOpen(user, challenge);
        
        if (emailResult.success) {
            res.json({ 
                message: 'Test email sent successfully!', 
                email: user.email,
                messageId: emailResult.messageId 
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to send email', 
                reason: emailResult.reason || emailResult.error 
            });
        }
        
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: 'Failed to send test email' });
    }
});

// Test database connection
router.get('/db-health', async (req, res) => {
    try {
        const result = await query('SELECT NOW() as current_time, version() as postgres_version');
        res.json({ 
            status: 'Database connected successfully',
            timestamp: result.rows[0].current_time,
            version: result.rows[0].postgres_version
        });
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Get sample data info
router.get('/sample-data', async (req, res) => {
    try {
        const challenges = await query('SELECT COUNT(*) as count FROM weekly_challenges');
        const games = await query('SELECT COUNT(*) as count FROM games');
        const trivia = await query('SELECT COUNT(*) as count FROM trivia_questions');
        const users = await query('SELECT COUNT(*) as count FROM users');
        
        res.json({
            challenges: parseInt(challenges.rows[0].count),
            games: parseInt(games.rows[0].count),
            trivia_questions: parseInt(trivia.rows[0].count),
            users: parseInt(users.rows[0].count)
        });
    } catch (error) {
        console.error('Sample data check failed:', error);
        res.status(500).json({ error: 'Failed to check sample data' });
    }
});

export default router;
