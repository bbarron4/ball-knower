import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current week's games with spreads (no auth for testing)
router.get('/games/current', async (req, res) => {
    try {
        // Get current challenge
        const challengeResult = await query(
            'SELECT id, week_number, season FROM weekly_challenges WHERE status = $1 ORDER BY opens_at DESC LIMIT 1',
            ['open']
        );

        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No active challenge found' });
        }

        const challenge = challengeResult.rows[0];

        // Get games for this challenge
        const gamesResult = await query(
            `SELECT id, home_team, away_team, kickoff_at, spread, home_team_favorite, is_marquee
             FROM games 
             WHERE challenge_id = $1 
             ORDER BY kickoff_at ASC`,
            [challenge.id]
        );

        const games = gamesResult.rows.map(game => ({
            id: game.id,
            home_team: game.home_team,
            away_team: game.away_team,
            kickoff_at: game.kickoff_at,
            spread: game.spread,
            home_team_favorite: game.home_team_favorite,
            is_marquee: game.is_marquee,
            favorite: game.home_team_favorite ? game.home_team : game.away_team,
            underdog: game.home_team_favorite ? game.away_team : game.home_team
        }));

        res.json({
            challenge: {
                id: challenge.id,
                week_number: challenge.week_number,
                season: challenge.season
            },
            games
        });
    } catch (error) {
        console.error('Get current games error:', error);
        res.status(500).json({ error: 'Failed to get current games' });
    }
});

// Submit weekly picks
router.post('/submit', authenticate, [
    body('picks').isArray().withMessage('Picks must be an array'),
    body('picks.*.gameId').isUUID().withMessage('Invalid game ID'),
    body('picks.*.selection').isIn(['FAV', 'DOG']).withMessage('Selection must be FAV or DOG'),
    body('triviaAnswers').isArray().withMessage('Trivia answers must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

        const { picks, triviaAnswers } = req.body;
        const userId = req.user.id;

        // Validate we have exactly 20 picks
        if (picks.length !== 20) {
            return res.status(400).json({ error: `Expected 20 picks, got ${picks.length}` });
        }

        // Get current challenge
        const challengeResult = await query(
            'SELECT id, week_number, season FROM weekly_challenges WHERE status = $1 ORDER BY opens_at DESC LIMIT 1',
            ['open']
        );

        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No active challenge found' });
        }

        const challenge = challengeResult.rows[0];
        const weekId = `${challenge.season}-W${challenge.week_number}`;

        // Check if user already submitted for this week
        const existingEntry = await query(
            'SELECT id FROM weekly_entries WHERE user_id = $1 AND challenge_id = $2',
            [userId, challenge.id]
        );

        if (existingEntry.rows.length > 0) {
            return res.status(400).json({ error: 'You have already submitted picks for this week' });
        }

        // Start transaction
        await query('BEGIN');

        try {
            // Create weekly entry
            const entryResult = await query(
                'INSERT INTO weekly_entries (user_id, challenge_id, week) VALUES ($1, $2, $3) RETURNING id',
                [userId, challenge.id, weekId]
            );
            const entryId = entryResult.rows[0].id;

            // Insert picks
            for (const pick of picks) {
                const gameResult = await query(
                    'SELECT spread FROM games WHERE id = $1',
                    [pick.gameId]
                );

                if (gameResult.rows.length === 0) {
                    throw new Error(`Game ${pick.gameId} not found`);
                }

                const spread = gameResult.rows[0].spread;

                await query(
                    `INSERT INTO weekly_picks (user_id, challenge_id, game_id, selection, line_shown, confidence)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [userId, challenge.id, pick.gameId, pick.selection, spread, 1] // Default confidence of 1 (not used in scoring)
                );
            }

            // Insert trivia answers
            for (const answer of triviaAnswers) {
                await query(
                    `INSERT INTO weekly_trivia_answers (user_id, challenge_id, question_id, source_pool, is_correct)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [userId, challenge.id, answer.questionId, answer.sourcePool || 'BALL_TRIVIA', answer.isCorrect]
                );
            }

            await query('COMMIT');

            res.json({
                message: 'Picks submitted successfully',
                entryId,
                week: weekId
            });
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
  } catch (error) {
        console.error('Submit picks error:', error);
        res.status(500).json({ error: 'Failed to submit picks' });
    }
});

// Get user's picks for current week
router.get('/my-picks', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get current challenge
        const challengeResult = await query(
            'SELECT id, week_number, season FROM weekly_challenges WHERE status = $1 ORDER BY opens_at DESC LIMIT 1',
            ['open']
        );

        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No active challenge found' });
        }

        const challenge = challengeResult.rows[0];

        // Get user's picks
        const picksResult = await query(
            `SELECT wp.*, g.home_team, g.away_team, g.spread, g.home_team_favorite
             FROM weekly_picks wp
             JOIN games g ON wp.game_id = g.id
             WHERE wp.user_id = $1 AND wp.challenge_id = $2`,
            [userId, challenge.id]
        );

        // Get user's trivia answers
        const triviaResult = await query(
            `SELECT wta.*, tq.prompt, tq.choices
             FROM weekly_trivia_answers wta
             JOIN trivia_questions tq ON wta.question_id = tq.id
             WHERE wta.user_id = $1 AND wta.challenge_id = $2`,
            [userId, challenge.id]
        );

        res.json({
            challenge: {
                id: challenge.id,
                week_number: challenge.week_number,
                season: challenge.season
            },
            picks: picksResult.rows,
            triviaAnswers: triviaResult.rows
        });
  } catch (error) {
        console.error('Get my picks error:', error);
    res.status(500).json({ error: 'Failed to get picks' });
  }
});

// Get weekly results
router.get('/results/:challengeId', authenticate, async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.user.id;

        // Get weekly results
        const resultsResult = await query(
            `SELECT wr.*, u.username, u.display_name
             FROM weekly_results wr
             JOIN users u ON wr.user_id = u.id
             WHERE wr.challenge_id = $1
             ORDER BY wr.total_points DESC, wr.computed_at ASC`,
            [challengeId]
        );

        // Get user's specific result
        const userResult = resultsResult.rows.find(row => row.user_id === userId);

        res.json({
            results: resultsResult.rows,
            userResult
        });
  } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Failed to get results' });
  }
});

export default router;