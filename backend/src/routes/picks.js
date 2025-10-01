import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, [
  body('game_id').isUUID(),
  body('selection').isIn(['home', 'away']),
  body('confidence').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { game_id, selection, confidence = 5 } = req.body;

    const game = await query('SELECT id, kickoff_at, challenge_id FROM games WHERE id = $1', [game_id]);
    if (game.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (new Date() >= new Date(game.rows[0].kickoff_at)) {
      return res.status(400).json({ error: 'Game has already started' });
    }

    const result = await query(
      `INSERT INTO picks (user_id, game_id, selection, confidence, locked_at)
       VALUES ($1, $2, $3, $4, NULL)
       ON CONFLICT (user_id, game_id)
       DO UPDATE SET selection = $3, confidence = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING id, selection, confidence`,
      [req.user.id, game_id, selection, confidence]
    );

    await query(
      'INSERT INTO events_analytics (user_id, event, properties) VALUES ($1, $2, $3)',
      [req.user.id, 'PICK_MADE', JSON.stringify({ game_id, selection, confidence })]
    );

    res.json({ message: 'Pick saved', pick: result.rows[0] });
  } catch (error) {
    console.error('Submit pick error:', error);
    res.status(500).json({ error: 'Failed to submit pick' });
  }
});

router.get('/my/:challengeId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.id, p.game_id, p.selection, p.confidence, p.locked_at, p.is_correct, p.points_awarded,
              g.home_team, g.away_team, g.kickoff_at
       FROM picks p
       JOIN games g ON p.game_id = g.id
       WHERE p.user_id = $1 AND g.challenge_id = $2
       ORDER BY g.kickoff_at ASC`,
      [req.user.id, req.params.challengeId]
    );

    res.json({ picks: result.rows });
  } catch (error) {
    console.error('Get picks error:', error);
    res.status(500).json({ error: 'Failed to get picks' });
  }
});

router.post('/lock/:challengeId', authenticate, async (req, res) => {
  try {
    await query(
      `UPDATE picks
       SET locked_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       AND game_id IN (SELECT id FROM games WHERE challenge_id = $2)
       AND locked_at IS NULL`,
      [req.user.id, req.params.challengeId]
    );

    await query(
      'INSERT INTO events_analytics (user_id, event, properties) VALUES ($1, $2, $3)',
      [req.user.id, 'PICK_LOCKED', JSON.stringify({ challenge_id: req.params.challengeId })]
    );

    res.json({ message: 'Picks locked successfully' });
  } catch (error) {
    console.error('Lock picks error:', error);
    res.status(500).json({ error: 'Failed to lock picks' });
  }
});

export default router;