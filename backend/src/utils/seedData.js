import { query } from '../config/database.js';

// Sample data for Ball Knower
const sampleData = {
  challenges: [
    {
      week_number: 5,
      season: 2024,
      status: 'open',
      opens_at: new Date('2024-10-01T12:00:00Z'),
      locks_at: new Date('2024-10-06T18:00:00Z')
    }
  ],
  
  games: [
    {
      home_team: 'Kansas City Chiefs',
      away_team: 'Buffalo Bills',
      kickoff_at: new Date('2024-10-06T20:00:00Z'),
      is_marquee: true
    },
    {
      home_team: 'Dallas Cowboys',
      away_team: 'Philadelphia Eagles',
      kickoff_at: new Date('2024-10-06T16:25:00Z'),
      is_marquee: true
    },
    {
      home_team: 'Miami Dolphins',
      away_team: 'New York Jets',
      kickoff_at: new Date('2024-10-06T13:00:00Z'),
      is_marquee: false
    },
    {
      home_team: 'San Francisco 49ers',
      away_team: 'Seattle Seahawks',
      kickoff_at: new Date('2024-10-06T16:05:00Z'),
      is_marquee: false
    },
    {
      home_team: 'Baltimore Ravens',
      away_team: 'Cincinnati Bengals',
      kickoff_at: new Date('2024-10-06T13:00:00Z'),
      is_marquee: false
    }
  ],
  
  triviaQuestions: [
    {
      prompt: "Which quarterback has the most career passing touchdowns in NFL history?",
      choices: ["Tom Brady", "Peyton Manning", "Drew Brees", "Brett Favre"],
      correct_index: 0,
      difficulty: "easy",
      tags: ["quarterbacks", "records", "history"]
    },
    {
      prompt: "What is the name of the trophy awarded to the Super Bowl MVP?",
      choices: ["Vince Lombardi Trophy", "Pete Rozelle Trophy", "Lamar Hunt Trophy", "George Halas Trophy"],
      correct_index: 1,
      difficulty: "med",
      tags: ["super-bowl", "awards", "history"]
    },
    {
      prompt: "Which team won the first Super Bowl?",
      choices: ["Green Bay Packers", "Kansas City Chiefs", "Dallas Cowboys", "Pittsburgh Steelers"],
      correct_index: 0,
      difficulty: "hard",
      tags: ["super-bowl", "history", "champions"]
    },
    {
      prompt: "How many points is a safety worth in football?",
      choices: ["1", "2", "3", "6"],
      correct_index: 1,
      difficulty: "easy",
      tags: ["rules", "scoring", "basics"]
    },
    {
      prompt: "Which player holds the record for most rushing yards in a single season?",
      choices: ["Eric Dickerson", "Adrian Peterson", "Barry Sanders", "Emmitt Smith"],
      correct_index: 0,
      difficulty: "hard",
      tags: ["records", "rushing", "season"]
    }
  ]
};

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create weekly challenge
    const challengeResult = await query(
      `INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        sampleData.challenges[0].week_number,
        sampleData.challenges[0].season,
        sampleData.challenges[0].status,
        sampleData.challenges[0].opens_at,
        sampleData.challenges[0].locks_at
      ]
    );
    
    const challengeId = challengeResult.rows[0].id;
    console.log('✅ Created weekly challenge:', challengeId);
    
    // Create games
    for (const game of sampleData.games) {
      await query(
        `INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, is_marquee)
         VALUES ($1, $2, $3, $4, $5)`,
        [challengeId, game.home_team, game.away_team, game.kickoff_at, game.is_marquee]
      );
    }
    console.log('✅ Created 5 games');
    
    // Create trivia questions
    for (const question of sampleData.triviaQuestions) {
      await query(
        `INSERT INTO trivia_questions (challenge_id, prompt, choices, correct_index, difficulty, tags, active)
         VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [
          challengeId,
          question.prompt,
          JSON.stringify(question.choices),
          question.correct_index,
          question.difficulty,
          JSON.stringify(question.tags)
        ]
      );
    }
    console.log('✅ Created 5 trivia questions');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Challenge ID: ${challengeId}`);
    console.log('🏈 You can now test the complete system!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
