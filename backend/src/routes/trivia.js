import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/:challengeId/start', authenticate, async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await query(
      'SELECT id, status FROM weekly_challenges WHERE id = $1',
      [challengeId]
    );

    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const existing = await query(
      'SELECT COUNT(*) as count FROM trivia_attempts WHERE user_id = $1 AND challenge_id = $2',
      [req.user.id, challengeId]
    );

    if (parseInt(existing.rows[0].count) >= 3) {
      return res.status(400).json({ error: 'Trivia already completed for this challenge' });
    }

    const questions = await query(
      `SELECT id, prompt, choices, difficulty
       FROM trivia_questions
       WHERE challenge_id = $1
       AND active = true
       AND id NOT IN (
         SELECT question_id FROM trivia_attempts WHERE user_id = $2 AND challenge_id = $1
       )
       ORDER BY RANDOM()
       LIMIT 3`,
      [challengeId, req.user.id]
    );

    if (questions.rows.length < 3) {
      return res.status(400).json({ error: 'Not enough questions available' });
    }

    await query(
      'INSERT INTO events_analytics (user_id, event, properties) VALUES ($1, $2, $3)',
      [req.user.id, 'TRIVIA_START', JSON.stringify({ challenge_id: challengeId })]
    );

    res.json({
      message: 'Trivia session started',
      questions: questions.rows.map(q => ({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        difficulty: q.difficulty
      })),
      timer_seconds: 15
    });
  } catch (error) {
    console.error('Start trivia error:', error);
    res.status(500).json({ error: 'Failed to start trivia' });
  }
});

router.post('/answer', authenticate, [
  body('question_id').isUUID(),
  body('challenge_id').isUUID(),
  body('answer_index').isInt({ min: 0, max: 3 }),
  body('response_ms').isInt({ min: 0, max: 15000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question_id, challenge_id, answer_index, response_ms } = req.body;

    const question = await query(
      'SELECT correct_index FROM trivia_questions WHERE id = $1',
      [question_id]
    );

    if (question.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correct = question.rows[0].correct_index === answer_index;

    let points = 0;
    if (correct) {
      points = 10;
      if (response_ms < 5000) points += 5;
      else if (response_ms < 10000) points += 3;
      else if (response_ms <= 15000) points += 1;
    }

    await query(
      `INSERT INTO trivia_attempts (user_id, challenge_id, question_id, answer_index, correct, response_ms, points_awarded, started_at, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP - ($6 || ' milliseconds')::interval, CURRENT_TIMESTAMP)`,
      [req.user.id, challenge_id, question_id, answer_index, correct, response_ms, points]
    );

    await query(
      'INSERT INTO events_analytics (user_id, event, properties) VALUES ($1, $2, $3)',
      [req.user.id, 'TRIVIA_ANSWER', JSON.stringify({ question_id, correct, points })]
    );

    res.json({ message: 'Answer submitted', correct, points_awarded: points });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

router.get('/my-attempts/:challengeId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT ta.id, ta.question_id, ta.answer_index, ta.correct, ta.response_ms, ta.points_awarded, ta.submitted_at,
              tq.prompt, tq.choices, tq.correct_index
       FROM trivia_attempts ta
       JOIN trivia_questions tq ON ta.question_id = tq.id
       WHERE ta.user_id = $1 AND ta.challenge_id = $2
       ORDER BY ta.submitted_at ASC`,
      [req.user.id, req.params.challengeId]
    );

    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ error: 'Failed to get attempts' });
  }
});

export default router;