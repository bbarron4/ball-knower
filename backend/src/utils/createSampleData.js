import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

async function createSampleData() {
    try {
        console.log('Creating sample data...');

        // Create a weekly challenge
        const challengeResult = await query(
            `INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [5, 2024, 'open', new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
        );
        const challengeId = challengeResult.rows[0].id;
        console.log('Created challenge:', challengeId);

        // Add some games
        const games = [
            ['Chiefs', 'Bills', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), true],
            ['Cowboys', 'Eagles', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), true],
            ['Ravens', 'Steelers', new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), false]
        ];

        for (const [home, away, kickoff, marquee] of games) {
            await query(
                `INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, is_marquee)
                 VALUES ($1, $2, $3, $4, $5)`,
                [challengeId, home, away, kickoff, marquee]
            );
        }
        console.log('Added games');

        // Add trivia questions
        const trivia = [
            ['Which team won Super Bowl LV?', JSON.stringify(['Chiefs', 'Buccaneers', 'Packers', 'Saints']), 1, 'med'],
            ['Who is the all-time leading passer in NFL history?', JSON.stringify(['Tom Brady', 'Drew Brees', 'Peyton Manning', 'Brett Favre']), 0, 'hard'],
            ['What year was the NFL founded?', JSON.stringify(['1920', '1930', '1940', '1950']), 0, 'easy']
        ];

        for (const [prompt, choices, correct, difficulty] of trivia) {
            await query(
                `INSERT INTO trivia_questions (challenge_id, prompt, choices, correct_index, difficulty)
                 VALUES ($1, $2, $3, $4, $5)`,
                [challengeId, prompt, choices, correct, difficulty]
            );
        }
        console.log('Added trivia questions');

        // Create some badges
        const badges = [
            ['first_pick', 'First Pick', 'Made your first weekly pick', '🎯'],
            ['streak_5', 'Hot Streak', 'Got 5 picks in a row correct', '🔥'],
            ['trivia_master', 'Trivia Master', 'Answered 10 trivia questions correctly', '🧠'],
            ['weekly_winner', 'Weekly Winner', 'Won a weekly challenge', '🏆']
        ];

        for (const [code, name, description, icon] of badges) {
            await query(
                `INSERT INTO badges (code, name, description, icon) VALUES ($1, $2, $3, $4)
                 ON CONFLICT (code) DO NOTHING`,
                [code, name, description, icon]
            );
        }
        console.log('Created badges');

        // Give some users badges
        const users = await query('SELECT id FROM users LIMIT 2');
        if (users.rows.length > 0) {
            const userId = users.rows[0].id;
            await query(
                `INSERT INTO user_badges (user_id, badge_code, awarded_at) VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, badge_code) DO NOTHING`,
                [userId, 'first_pick', new Date()]
            );
            console.log('Awarded badges to user');
        }

        console.log('Sample data created successfully!');
    } catch (error) {
        console.error('Error creating sample data:', error);
    } finally {
        process.exit();
    }
}

createSampleData();
