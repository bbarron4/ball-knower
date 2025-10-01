import express from 'express';
import { query } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:challengeId/global', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const result = await query(
      `SELECT l.rank, l.picks_points, l.trivia_points, l.total_points,
              u.id, u.username, u.display_name, u.favorite_team
       FROM leaderboards l
       JOIN users u ON l.user_id = u.id
       WHERE l.challenge_id = $1
       ORDER BY l.rank ASC
       LIMIT $2`,
      [req.params.challengeId, limit]
    );

    await query(
      'INSERT INTO events_analytics (user_id, event, properties) VALUES ($1, $2, $3)',
      [req.user?.id || null, 'LEADERBOARD_VIEW', JSON.stringify({ challenge_id: req.params.challengeId, type: 'global' })]
    );

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

router.get('/:challengeId/trivia', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const result = await query(
      `SELECT lt.rank, lt.trivia_points, lt.attempts_count,
              u.id, u.username, u.display_name, u.favorite_team
       FROM leaderboards_trivia lt
       JOIN users u ON lt.user_id = u.id
       WHERE lt.challenge_id = $1
       ORDER BY lt.rank ASC
       LIMIT $2`,
      [req.params.challengeId, limit]
    );

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Get trivia leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get trivia leaderboard' });
  }
});

router.get('/:challengeId/groups/:groupId', optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT l.rank, l.picks_points, l.trivia_points, l.total_points,
              u.id, u.username, u.display_name, u.favorite_team
       FROM leaderboards l
       JOIN users u ON l.user_id = u.id
       JOIN group_members gm ON u.id = gm.user_id
       WHERE l.challenge_id = $1 AND gm.group_id = $2
       ORDER BY l.total_points DESC`,
      [req.params.challengeId, req.params.groupId]
    );

    res.json({ leaderboard: result.rows });
  } catch (error) {
    console.error('Get group leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get group leaderboard' });
  }
});

export default router;