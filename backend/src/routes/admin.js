import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Test route without auth for development
router.post('/test-games/week/:week', [
  body('games').isArray().withMessage('Games must be an array'),
  body('games.*.league').isIn(['NFL', 'COLLEGE']).withMessage('League must be NFL or COLLEGE'),
  body('games.*.awayTeam').notEmpty().withMessage('Away team is required'),
  body('games.*.homeTeam').notEmpty().withMessage('Home team is required'),
  body('games.*.spread').isNumeric().withMessage('Spread must be a number'),
  body('games.*.gameTime').isISO8601().withMessage('Game time must be valid ISO date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { week } = req.params;
    const { games } = req.body;
    const weekNumber = parseInt(week);
    
    if (isNaN(weekNumber)) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    if (games.length === 0) {
      return res.status(400).json({ error: 'No games provided' });
    }

    // Get or create challenge for this week
    const season = 2024;
    let challengeResult = await query(
      'SELECT id FROM weekly_challenges WHERE week_number = $1 AND season = $2',
      [weekNumber, season]
    );

    let challengeId;
    if (challengeResult.rows.length === 0) {
      // Create new challenge
      const newChallengeResult = await query(
        `INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at)
         VALUES ($1, $2, 'open', NOW(), NOW() + INTERVAL '7 days')
         RETURNING id`,
        [weekNumber, season]
      );
      challengeId = newChallengeResult.rows[0].id;
    } else {
      challengeId = challengeResult.rows[0].id;
    }

    // Clear existing games for this challenge
    await query('DELETE FROM games WHERE challenge_id = $1', [challengeId]);

    // Insert new games
    for (const game of games) {
      const homeTeamFavorite = game.spread < 0; // Negative spread means home team is favorite
      
      await query(
        `INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, spread, home_team_favorite, is_marquee)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          challengeId,
          game.homeTeam,
          game.awayTeam,
          new Date(game.gameTime),
          game.spread,
          homeTeamFavorite,
          true // All games are marquee for now
        ]
      );
    }

    res.json({ 
      message: `Successfully added ${games.length} games for Week ${weekNumber}`,
      challengeId,
      gamesAdded: games.length
    });
  } catch (error) {
    console.error('Test games error:', error);
    res.status(500).json({ error: 'Failed to add test games' });
  }
});

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

    // Grade weekly picks (new system: 1 point per correct pick)
    await query(
      `UPDATE weekly_picks wp
       SET is_correct = (
         CASE 
           WHEN wp.selection = 'FAV' AND g.home_team_favorite = true AND $1 = 'home' THEN true
           WHEN wp.selection = 'FAV' AND g.home_team_favorite = false AND $1 = 'away' THEN true
           WHEN wp.selection = 'DOG' AND g.home_team_favorite = true AND $1 = 'away' THEN true
           WHEN wp.selection = 'DOG' AND g.home_team_favorite = false AND $1 = 'home' THEN true
           ELSE false
         END
       ),
       points_awarded = (
         CASE 
           WHEN wp.selection = 'FAV' AND g.home_team_favorite = true AND $1 = 'home' THEN 1
           WHEN wp.selection = 'FAV' AND g.home_team_favorite = false AND $1 = 'away' THEN 1
           WHEN wp.selection = 'DOG' AND g.home_team_favorite = true AND $1 = 'away' THEN 1
           WHEN wp.selection = 'DOG' AND g.home_team_favorite = false AND $1 = 'home' THEN 1
           ELSE 0
         END
       )
       FROM games g
       WHERE wp.game_id = g.id AND wp.game_id = $2`,
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

    // Rebuild leaderboard using weekly_picks table (new system)
    await query(
      `INSERT INTO leaderboards (challenge_id, user_id, picks_points, trivia_points, total_points)
       SELECT
         $1 as challenge_id,
         u.id as user_id,
         COALESCE(SUM(wp.points_awarded), 0) as picks_points,
         0 as trivia_points, -- No trivia in new system
         COALESCE(SUM(wp.points_awarded), 0) as total_points
       FROM users u
       LEFT JOIN weekly_picks wp ON u.id = wp.user_id AND wp.challenge_id = $1
       WHERE u.id IN (
         SELECT DISTINCT user_id FROM weekly_picks WHERE challenge_id = $1
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

// Get games for a specific week
router.get('/games/week/:week', async (req, res) => {
  try {
    const { week } = req.params;
    const weekNumber = parseInt(week);
    
    if (isNaN(weekNumber)) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    // Get current season (assuming 2024 for now)
    const season = 2024;
    
    // Get challenge for this week
    const challengeResult = await query(
      'SELECT id FROM weekly_challenges WHERE week_number = $1 AND season = $2',
      [weekNumber, season]
    );

    if (challengeResult.rows.length === 0) {
      return res.json([]);
    }

    const challengeId = challengeResult.rows[0].id;

    // Get games for this challenge
    const gamesResult = await query(
      `SELECT id, home_team, away_team, kickoff_at, spread, home_team_favorite, is_marquee
       FROM games 
       WHERE challenge_id = $1 
       ORDER BY kickoff_at ASC`,
      [challengeId]
    );

    const games = gamesResult.rows.map(game => ({
      id: game.id,
      home_team: game.home_team,
      away_team: game.away_team,
      kickoff_at: game.kickoff_at,
      spread: game.spread,
      home_team_favorite: game.home_team_favorite,
      is_marquee: game.is_marquee
    }));

    res.json(games);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
});

// Submit games for a specific week
router.post('/games/week/:week', [
  body('games').isArray().withMessage('Games must be an array'),
  body('games.*.league').isIn(['NFL', 'COLLEGE']).withMessage('League must be NFL or COLLEGE'),
  body('games.*.awayTeam').notEmpty().withMessage('Away team is required'),
  body('games.*.homeTeam').notEmpty().withMessage('Home team is required'),
  body('games.*.spread').isNumeric().withMessage('Spread must be a number'),
  body('games.*.gameTime').isISO8601().withMessage('Game time must be valid ISO date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { week } = req.params;
    const { games } = req.body;
    const weekNumber = parseInt(week);
    
    if (isNaN(weekNumber)) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    if (games.length === 0) {
      return res.status(400).json({ error: 'No games provided' });
    }

    // Get or create challenge for this week
    const season = 2024;
    let challengeResult = await query(
      'SELECT id FROM weekly_challenges WHERE week_number = $1 AND season = $2',
      [weekNumber, season]
    );

    let challengeId;
    if (challengeResult.rows.length === 0) {
      // Create new challenge
      const newChallengeResult = await query(
        `INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at)
         VALUES ($1, $2, 'draft', NOW(), NOW() + INTERVAL '7 days')
         RETURNING id`,
        [weekNumber, season]
      );
      challengeId = newChallengeResult.rows[0].id;
    } else {
      challengeId = challengeResult.rows[0].id;
    }

    // Clear existing games for this challenge
    await query('DELETE FROM games WHERE challenge_id = $1', [challengeId]);

    // Insert new games
    for (const game of games) {
      const homeTeamFavorite = game.spread < 0; // Negative spread means home team is favorite
      
      await query(
        `INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, spread, home_team_favorite, is_marquee)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          challengeId,
          game.homeTeam,
          game.awayTeam,
          new Date(game.gameTime),
          game.spread,
          homeTeamFavorite,
          true // All games are marquee for now
        ]
      );
    }

    res.json({ 
      message: `Successfully added ${games.length} games for Week ${weekNumber}`,
      challengeId,
      gamesAdded: games.length
    });
  } catch (error) {
    console.error('Submit games error:', error);
    res.status(500).json({ error: 'Failed to submit games' });
  }
});

export default router;