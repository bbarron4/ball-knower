// Weekly Challenge Games from Excel file
const WEEKLY_CHALLENGE_GAMES = [
  {
    "id": "game_1",
    "home_team": "49ers",
    "away_team": "Buccaneers",
    "spread": -2.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869090",
    "is_marquee": true
  },
  {
    "id": "game_2",
    "home_team": "Seahawks",
    "away_team": "Jaguars",
    "spread": -1.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869198",
    "is_marquee": true
  },
  {
    "id": "game_3",
    "home_team": "Lions",
    "away_team": "Chiefs",
    "spread": -2.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869283",
    "is_marquee": true
  },
  {
    "id": "game_4",
    "home_team": "Bills",
    "away_team": "Falcons",
    "spread": -4.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869355",
    "is_marquee": true
  },
  {
    "id": "game_5",
    "home_team": "Cardinals",
    "away_team": "Colts",
    "spread": -7.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869428",
    "is_marquee": true
  },
  {
    "id": "game_6",
    "home_team": "#1 Ohio State",
    "away_team": "#17 Illinois",
    "spread": -14.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869501",
    "is_marquee": true
  },
  {
    "id": "game_7",
    "home_team": "#8 Alabama",
    "away_team": "#14 Missouri",
    "spread": -2.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869572",
    "is_marquee": true
  },
  {
    "id": "game_8",
    "home_team": "#7 Indiana",
    "away_team": "#3 Oregon",
    "spread": -7.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869642",
    "is_marquee": true
  },
  {
    "id": "game_9",
    "home_team": "#6 Oklahoma",
    "away_team": "Texas",
    "spread": -1.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869708",
    "is_marquee": true
  },
  {
    "id": "game_10",
    "home_team": "#10 Georgia ",
    "away_team": "Auburn ",
    "spread": -3.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869777",
    "is_marquee": true
  }
];

const NFL_WEEKLY_GAMES = [
  {
    "id": "game_1",
    "home_team": "49ers",
    "away_team": "Buccaneers",
    "spread": -2.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869090",
    "is_marquee": true
  },
  {
    "id": "game_2",
    "home_team": "Seahawks",
    "away_team": "Jaguars",
    "spread": -1.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869198",
    "is_marquee": true
  },
  {
    "id": "game_3",
    "home_team": "Lions",
    "away_team": "Chiefs",
    "spread": -2.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869283",
    "is_marquee": true
  },
  {
    "id": "game_4",
    "home_team": "Bills",
    "away_team": "Falcons",
    "spread": -4.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869355",
    "is_marquee": true
  },
  {
    "id": "game_5",
    "home_team": "Cardinals",
    "away_team": "Colts",
    "spread": -7.5,
    "type": "NFL",
    "kickoff_at": "2025-10-08T17:00:23.869428",
    "is_marquee": true
  }
];

const COLLEGE_WEEKLY_GAMES = [
  {
    "id": "game_6",
    "home_team": "#1 Ohio State",
    "away_team": "#17 Illinois",
    "spread": -14.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869501",
    "is_marquee": true
  },
  {
    "id": "game_7",
    "home_team": "#8 Alabama",
    "away_team": "#14 Missouri",
    "spread": -2.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869572",
    "is_marquee": true
  },
  {
    "id": "game_8",
    "home_team": "#7 Indiana",
    "away_team": "#3 Oregon",
    "spread": -7.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869642",
    "is_marquee": true
  },
  {
    "id": "game_9",
    "home_team": "#6 Oklahoma",
    "away_team": "Texas",
    "spread": -1.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869708",
    "is_marquee": true
  },
  {
    "id": "game_10",
    "home_team": "#10 Georgia ",
    "away_team": "Auburn ",
    "spread": -3.5,
    "type": "COLLEGE",
    "kickoff_at": "2025-10-08T17:00:23.869777",
    "is_marquee": true
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WEEKLY_CHALLENGE_GAMES,
        NFL_WEEKLY_GAMES,
        COLLEGE_WEEKLY_GAMES
    };
}
