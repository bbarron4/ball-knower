import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get random trivia questions
router.get('/questions/random', authenticate, async (req, res) => {
    try {
        const { count = 5 } = req.query;
        
        // Get random questions from the database
        const result = await query(
            `SELECT id, prompt, choices, correct_index, difficulty, 
                    CASE 
                        WHEN RANDOM() < 0.5 THEN 'BALL_TRIVIA'
                        ELSE 'COLLEGE_GUESSER'
                    END as source_pool
             FROM trivia_questions 
             ORDER BY RANDOM() 
             LIMIT $1`,
            [parseInt(count)]
        );
        
        const questions = result.rows.map(q => ({
            id: q.id,
            prompt: q.prompt,
            choices: q.choices,
            correct_index: q.correct_index,
            difficulty: q.difficulty,
            source_pool: q.source_pool
        }));
        
        res.json({ questions });
    } catch (error) {
        console.error('Get random trivia error:', error);
        res.status(500).json({ error: 'Failed to get trivia questions' });
    }
});

// Submit trivia answers
router.post('/submit', authenticate, [
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId').isUUID().withMessage('Invalid question ID'),
    body('answers.*.choiceIndex').isInt({ min: -1, max: 3 }).withMessage('Invalid choice index')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { answers } = req.body;
        const userId = req.user.id;
        
        // Get current challenge
        const challengeResult = await query(
            'SELECT id FROM weekly_challenges WHERE status = $1 ORDER BY opens_at DESC LIMIT 1',
            ['open']
        );
        
        if (challengeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No active challenge found' });
        }
        
        const challengeId = challengeResult.rows[0].id;
        
        // Check if user already submitted trivia for this week
        const existingTrivia = await query(
            'SELECT id FROM weekly_trivia_answers WHERE user_id = $1 AND challenge_id = $2',
            [userId, challengeId]
        );
        
        if (existingTrivia.rows.length > 0) {
            return res.status(400).json({ error: 'You have already submitted trivia for this week' });
        }
        
        // Process answers and calculate score
        let correctAnswers = 0;
        const triviaAnswers = [];
        
        for (const answer of answers) {
            // Get the correct answer
            const questionResult = await query(
                'SELECT correct_index FROM trivia_questions WHERE id = $1',
                [answer.questionId]
            );
            
            if (questionResult.rows.length === 0) {
                continue; // Skip invalid questions
            }
            
            const correctIndex = questionResult.rows[0].correct_index;
            const isCorrect = answer.choiceIndex === correctIndex;
            
            if (isCorrect) {
                correctAnswers++;
            }
            
            triviaAnswers.push({
                questionId: answer.questionId,
                isCorrect: isCorrect,
                sourcePool: 'BALL_TRIVIA' // Default for now
            });
        }
        
        // Insert trivia answers
        for (const answer of triviaAnswers) {
            await query(
                `INSERT INTO weekly_trivia_answers (user_id, challenge_id, question_id, source_pool, is_correct)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, challengeId, answer.questionId, answer.sourcePool, answer.isCorrect]
            );
        }
        
        // Update weekly results with trivia points
        await query(
            `INSERT INTO weekly_results (user_id, challenge_id, trivia_points, total_points)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, challenge_id) 
             DO UPDATE SET 
                 trivia_points = $3,
                 total_points = weekly_results.pick_points + $3`,
            [userId, challengeId, correctAnswers, correctAnswers]
        );
        
        res.json({
            message: 'Trivia answers submitted successfully',
            correctAnswers: correctAnswers,
            totalQuestions: answers.length
        });
        
    } catch (error) {
        console.error('Submit trivia error:', error);
        res.status(500).json({ error: 'Failed to submit trivia answers' });
    }
});

export default router;