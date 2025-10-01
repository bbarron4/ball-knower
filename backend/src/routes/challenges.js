import express from 'express';
import { query } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/current', optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, week_number, season, status, opens_at, locks_at, created_at
       FROM weekly_challenges
       WHERE status = 'open'
       ORDER BY opens_at DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active challenge found' });
    }

    const challenge = result.rows[0];

    if (req.user) {
      const picks = await query(
        'SELECT COUNT(*) as count FROM picks WHERE user_id = $1 AND game_id IN (SELECT id FROM games WHERE challenge_id = $2)',
        [req.user.id, challenge.id]
      );

      const trivia = await query(
        'SELECT COUNT(*) as count FROM trivia_attempts WHERE user_id = $1 AND challenge_id = $2',
        [req.user.id, challenge.id]
      );

      challenge.user_progress = {
        picks_complete: parseInt(picks.rows[0].count),
        trivia_complete: parseInt(trivia.rows[0].count)
      };
    }

    res.json({ challenge });
  } catch (error) {
    console.error('Get current challenge error:', error);
    res.status(500).json({ error: 'Failed to get challenge' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, week_number, season, status, opens_at, locks_at FROM weekly_challenges WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({ challenge: result.rows[0] });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Failed to get challenge' });
  }
});

router.get('/:id/games', async (req, res) => {
  try {
    const games = await query(
      `SELECT id, home_team, away_team, kickoff_at, is_marquee, final_home_score, final_away_score, winner
       FROM games
       WHERE challenge_id = $1
       ORDER BY kickoff_at ASC`,
      [req.params.id]
    );

    const gamesWithStats = await Promise.all(games.rows.map(async (game) => {
      const pickStats = await query(
        `SELECT selection, COUNT(*) as count FROM picks WHERE game_id = $1 GROUP BY selection`,
        [game.id]
      );

      const total = pickStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
      const homePicks = pickStats.rows.find(r => r.selection === 'home')?.count || 0;

      return {
        ...game,
        community_pick_pct: {
          home: total > 0 ? (homePicks / total * 100).toFixed(1) : 0,
          away: total > 0 ? ((total - homePicks) / total * 100).toFixed(1) : 0
        }
      };
    }));

    res.json({ games: gamesWithStats });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
});

export default router;