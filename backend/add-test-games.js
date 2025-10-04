import { query } from './src/config/database.js';

async function addTestGames() {
  try {
    console.log("Adding 20 test games...");
    
    // Create or get challenge for week 1
    let challengeResult = await query(
      "SELECT id FROM weekly_challenges WHERE week_number = 1 AND season = 2024"
    );
    
    let challengeId;
    if (challengeResult.rows.length === 0) {
      const newChallengeResult = await query(
        "INSERT INTO weekly_challenges (week_number, season, status, opens_at, locks_at) VALUES (1, 2024, 'open', NOW(), NOW() + INTERVAL '7 days') RETURNING id"
      );
      challengeId = newChallengeResult.rows[0].id;
    } else {
      challengeId = challengeResult.rows[0].id;
    }
    
    console.log("Challenge ID:", challengeId);
    
    // Clear existing games
    await query("DELETE FROM games WHERE challenge_id = $1", [challengeId]);
    
    // Add 10 NFL games
    const nflGames = [
      ["Kansas City Chiefs", "Detroit Lions", -3.5, "2024-09-05T20:20:00Z"],
      ["Buffalo Bills", "Miami Dolphins", -2.5, "2024-09-08T13:00:00Z"],
      ["Dallas Cowboys", "Philadelphia Eagles", 1.5, "2024-09-08T16:25:00Z"],
      ["San Francisco 49ers", "Los Angeles Rams", -4.5, "2024-09-08T20:20:00Z"],
      ["Cincinnati Bengals", "Cleveland Browns", 2.5, "2024-09-09T13:00:00Z"],
      ["New York Jets", "New England Patriots", -1.5, "2024-09-09T16:25:00Z"],
      ["Las Vegas Raiders", "Denver Broncos", 3.5, "2024-09-09T20:15:00Z"],
      ["Tampa Bay Buccaneers", "New Orleans Saints", 1.5, "2024-09-10T20:15:00Z"],
      ["Pittsburgh Steelers", "Baltimore Ravens", 4.5, "2024-09-11T13:00:00Z"],
      ["Green Bay Packers", "Chicago Bears", -2.5, "2024-09-11T16:25:00Z"]
    ];
    
    // Add 10 College games
    const collegeGames = [
      ["Alabama Crimson Tide", "Georgia Bulldogs", 3.5, "2024-09-07T15:30:00Z"],
      ["Ohio State Buckeyes", "Michigan Wolverines", 1.5, "2024-09-07T12:00:00Z"],
      ["Texas Longhorns", "Oklahoma Sooners", -2.5, "2024-09-07T18:00:00Z"],
      ["LSU Tigers", "Auburn Tigers", 4.5, "2024-09-08T15:00:00Z"],
      ["Florida Gators", "Tennessee Volunteers", 2.5, "2024-09-08T12:00:00Z"],
      ["USC Trojans", "UCLA Bruins", -1.5, "2024-09-08T20:00:00Z"],
      ["Notre Dame Fighting Irish", "Stanford Cardinal", -3.5, "2024-09-09T15:30:00Z"],
      ["Clemson Tigers", "Florida State Seminoles", 1.5, "2024-09-09T18:00:00Z"],
      ["Penn State Nittany Lions", "Michigan State Spartans", -2.5, "2024-09-10T15:00:00Z"],
      ["Oregon Ducks", "Washington Huskies", 3.5, "2024-09-10T18:30:00Z"]
    ];
    
    const allGames = [...nflGames, ...collegeGames];
    
    for (const [awayTeam, homeTeam, spread, gameTime] of allGames) {
      const homeTeamFavorite = spread < 0;
      await query(
        "INSERT INTO games (challenge_id, home_team, away_team, kickoff_at, spread, home_team_favorite, is_marquee) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [challengeId, homeTeam, awayTeam, new Date(gameTime), spread, homeTeamFavorite, true]
      );
    }
    
    console.log(`Successfully added ${allGames.length} games!`);
    console.log("NFL Games:", nflGames.length);
    console.log("College Games:", collegeGames.length);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addTestGames();
