import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/challenges', [
  body('week_number').isInt(),
  body('season').isInt(),
  body('opens_at').isISO8601(),
  body('locks_at').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { week_number, season, opens_at, locks_at } = req.body;

    const result = await query(
      `INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at)
       VALUES ($1, $2, 'draft', $3, $4)
       RETURNING *`,
      [week_number, season, opens_at, locks_at]
    );

    res.status(201).json({ message: 'Challenge created', challenge: result.rows[0] });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

router.post('/games', [
  body('challenge_id').isUUID(),
  body('home_team').trim().notEmpty(),
  body('away_team').trim().notEmpty(),
  body('kickoff_at').isISO8601(),
  body('is_marquee').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { challenge_id, home_team, away_team, kickoff_at, is_marquee = true } = req.body;

    const result = await query(
      `INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, is_marquee)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [challenge_id, home_team, away_team, kickoff_at, is_marquee]
    );

    res.status(201).json({ message: 'Game added', game: result.rows[0] });
  } catch (error) {
    console.error('Add game error:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

router.post('/trivia', [
  body('challenge_id').isUUID(),
  body('prompt').trim().notEmpty(),
  body('choices').isArray({ min: 4, max: 4 }),
  body('correct_index').isInt({ min: 0, max: 3 }),
  body('difficulty').optional().isIn(['easy', 'med', 'hard']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { challenge_id, prompt, choices, correct_index, difficulty = 'med', tags = [] } = req.body;

    const result = await query(
      `INSERT INTO trivia_questions (challenge_id, prompt, choices, correct_index, difficulty, tags, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [challenge_id, prompt, JSON.stringify(choices), correct_index, difficulty, JSON.stringify(tags)]
    );

    res.status(201).json({ message: 'Trivia question added', question: result.rows[0] });
  } catch (error) {
    console.error('Add trivia error:', error);
    res.status(500).json({ error: 'Failed to add trivia question' });
  }
});

router.post('/games/:id/finalize', [
  body('final_home_score').isInt({ min: 0 }),
  body('final_away_score').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { final_home_score, final_away_score } = req.body;
    const winner = final_home_score > final_away_score ? 'home' : final_home_score < final_away_score ? 'away' : 'draw';

    await query(
      'UPDATE games SET final_home_score = $1, final_away_score = $2, winner = $3 WHERE id = $4',
      [final_home_score, final_away_score, winner, req.params.id]
    );

    await query(
      `UPDATE picks
       SET is_correct = (selection = $1),
           points_awarded = CASE
             WHEN selection = $1 THEN 10 + COALESCE(confidence, 0)
             ELSE 0
           END
       WHERE game_id = $2`,
      [winner, req.params.id]
    );

    res.json({ message: 'Game finalized and picks graded' });
  } catch (error) {
    console.error('Finalize game error:', error);
    res.status(500).json({ error: 'Failed to finalize game' });
  }
});

router.patch('/challenges/:id/status', [
  body('status').isIn(['draft', 'open', 'locked', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await query(
      'UPDATE weekly_challenges SET status = $1 WHERE id = $2',
      [req.body.status, req.params.id]
    );

    res.json({ message: 'Challenge status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.post('/leaderboards/:challengeId/rebuild', async (req, res) => {
  try {
    const { challengeId } = req.params;

    await query('DELETE FROM leaderboards WHERE challenge_id = $1', [challengeId]);
    await query('DELETE FROM leaderboards_trivia WHERE challenge_id = $1', [challengeId]);

    await query(
      `INSERT INTO leaderboards (challenge_id, user_id, picks_points, trivia_points, total_points)
       SELECT
         $1 as challenge_id,
         u.id as user_id,
         COALESCE(SUM(p.points_awarded), 0) as picks_points,
         COALESCE(SUM(ta.points_awarded), 0) as trivia_points,
         COALESCE(SUM(p.points_awarded), 0) + COALESCE(SUM(ta.points_awarded), 0) as total_points
       FROM users u
       LEFT JOIN picks p ON u.id = p.user_id AND p.game_id IN (SELECT id FROM games WHERE challenge_id = $1)
       LEFT JOIN trivia_attempts ta ON u.id = ta.user_id AND ta.challenge_id = $1
       WHERE u.id IN (
         SELECT DISTINCT user_id FROM picks WHERE game_id IN (SELECT id FROM games WHERE challenge_id = $1)
         UNION
         SELECT DISTINCT user_id FROM trivia_attempts WHERE challenge_id = $1
       )
       GROUP BY u.id`,
      [challengeId]
    );

    await query(
      `UPDATE leaderboards l1
       SET rank = (
         SELECT COUNT(*) + 1
         FROM leaderboards l2
         WHERE l2.challenge_id = l1.challenge_id AND l2.total_points > l1.total_points
       )
       WHERE l1.challenge_id = $1`,
      [challengeId]
    );

    await query(
      `INSERT INTO leaderboards_trivia (challenge_id, user_id, trivia_points, attempts_count)
       SELECT challenge_id, user_id, SUM(points_awarded) as trivia_points, COUNT(*) as attempts_count
       FROM trivia_attempts
       WHERE challenge_id = $1
       GROUP BY challenge_id, user_id`,
      [challengeId]
    );

    await query(
      `UPDATE leaderboards_trivia l1
       SET rank = (
         SELECT COUNT(*) + 1
         FROM leaderboards_trivia l2
         WHERE l2.challenge_id = l1.challenge_id AND l2.trivia_points > l1.trivia_points
       )
       WHERE l1.challenge_id = $1`,
      [challengeId]
    );

    res.json({ message: 'Leaderboards rebuilt successfully' });
  } catch (error) {
    console.error('Rebuild leaderboard error:', error);
    res.status(500).json({ error: 'Failed to rebuild leaderboards' });
  }
});

export default router;