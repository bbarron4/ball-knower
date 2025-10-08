import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper function to update user stats
async function updateUserStats(userId) {
  try {
    // Get all completed game sessions for this user
    const sessionsResult = await query(
      `SELECT questions_answered, correct_answers, final_score, streak, completed_at
       FROM game_sessions 
       WHERE user_id = $1 AND is_completed = true
       ORDER BY completed_at DESC`,
      [userId]
    );

    if (sessionsResult.rows.length === 0) {
      return; // No completed sessions
    }

    const sessions = sessionsResult.rows;
    
    // Calculate totals
    const totalGames = sessions.length;
    const totalQuestionsAnswered = sessions.reduce((sum, s) => sum + (s.questions_answered || 0), 0);
    const totalCorrectAnswers = sessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalScore = sessions.reduce((sum, s) => sum + (s.final_score || 0), 0);
    const bestStreak = Math.max(...sessions.map(s => s.streak || 0));
    const averageScore = totalGames > 0 ? totalScore / totalGames : 0;
    const accuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0;
    const lastPlayedAt = sessions[0].completed_at;

    // Insert or update user stats
    await query(
      `INSERT INTO user_stats (user_id, total_games, total_questions_answered, total_correct_answers, 
                              best_streak, average_score, total_score, accuracy, last_played_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) 
       DO UPDATE SET
         total_games = $2,
         total_questions_answered = $3,
         total_correct_answers = $4,
         best_streak = $5,
         average_score = $6,
         total_score = $7,
         accuracy = $8,
         last_played_at = $9,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, totalGames, totalQuestionsAnswered, totalCorrectAnswers, bestStreak, averageScore, totalScore, accuracy, lastPlayedAt]
    );

    console.log(`✅ Updated stats for user ${userId}: ${totalGames} games, ${bestStreak} best streak, ${accuracy}% accuracy`);
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

// Get user statistics
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT us.*, s.current_pick_streak, s.best_pick_streak
       FROM user_stats us
       LEFT JOIN streaks s ON us.user_id = s.user_id
       WHERE us.user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      // Create initial stats if they don't exist
      await query(
        `INSERT INTO user_stats (user_id) VALUES ($1)`,
        [req.user.id]
      );
      
      // Return default stats
      return res.json({
        total_games: 0,
        total_questions_answered: 0,
        total_correct_answers: 0,
        best_streak: 0,
        current_streak: 0,
        average_score: 0,
        total_score: 0,
        accuracy: 0
      });
    }

    const stats = result.rows[0];
    const accuracy = stats.total_questions_answered > 0 
      ? Math.round((stats.total_correct_answers / stats.total_questions_answered) * 100)
      : 0;

    res.json({
      total_games: stats.total_games || 0,
      total_questions_answered: stats.total_questions_answered || 0,
      total_correct_answers: stats.total_correct_answers || 0,
      best_streak: stats.best_streak || 0,
      current_streak: stats.current_streak || 0,
      average_score: parseFloat(stats.average_score) || 0,
      total_score: stats.total_score || 0,
      accuracy: accuracy
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

// Start a new game session
router.post('/sessions', authenticate, [
  body('game_mode').isIn(['trivia', 'college', 'jersey']).withMessage('Invalid game mode'),
  body('sport').isIn(['nfl', 'nba', 'both']).withMessage('Invalid sport')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { game_mode, sport } = req.body;

    const result = await query(
      `INSERT INTO game_sessions (user_id, game_mode, sport)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [req.user.id, game_mode, sport]
    );

    res.json({ session_id: result.rows[0].id });
  } catch (error) {
    console.error('Start game session error:', error);
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

// Update game session progress
router.patch('/sessions/:id', authenticate, [
  body('questions_answered').optional().isInt({ min: 0 }),
  body('correct_answers').optional().isInt({ min: 0 }),
  body('current_score').optional().isInt({ min: 0 }),
  body('current_streak').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questions_answered, correct_answers, current_score, current_streak } = req.body;
    const sessionId = req.params.id;

    // Verify the session belongs to the user
    const sessionCheck = await query(
      'SELECT user_id FROM game_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    if (sessionCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the session
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (questions_answered !== undefined) {
      updateFields.push(`questions_answered = $${paramCount++}`);
      updateValues.push(questions_answered);
    }
    if (correct_answers !== undefined) {
      updateFields.push(`correct_answers = $${paramCount++}`);
      updateValues.push(correct_answers);
    }
    if (current_score !== undefined) {
      updateFields.push(`final_score = $${paramCount++}`);
      updateValues.push(current_score);
    }
    if (current_streak !== undefined) {
      updateFields.push(`streak = $${paramCount++}`);
      updateValues.push(current_streak);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(sessionId);

    await query(
      `UPDATE game_sessions SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      updateValues
    );

    res.json({ message: 'Game session updated' });
  } catch (error) {
    console.error('Update game session error:', error);
    res.status(500).json({ error: 'Failed to update game session' });
  }
});

// Complete a game session
router.post('/sessions/:id/complete', authenticate, [
  body('final_score').isInt({ min: 0 }),
  body('final_streak').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { final_score, final_streak } = req.body;
    const sessionId = req.params.id;

    // Verify the session belongs to the user
    const sessionCheck = await query(
      'SELECT user_id FROM game_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    if (sessionCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Complete the session
    await query(
      `UPDATE game_sessions 
       SET final_score = $1, streak = $2, completed_at = CURRENT_TIMESTAMP, is_completed = true
       WHERE id = $3`,
      [final_score, final_streak, sessionId]
    );

    // Update user stats
    await updateUserStats(req.user.id);

    res.json({ message: 'Game session completed' });
  } catch (error) {
    console.error('Complete game session error:', error);
    res.status(500).json({ error: 'Failed to complete game session' });
  }
});

// Get leaderboard for today's top players
router.get('/leaderboard/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await query(
      `SELECT u.username, u.display_name, us.best_streak, us.total_games, us.accuracy
       FROM user_stats us
       JOIN users u ON us.user_id = u.id
       WHERE us.last_played_at >= $1
       ORDER BY us.best_streak DESC, us.total_games DESC
       LIMIT 10`,
      [`${today} 00:00:00`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get today leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
