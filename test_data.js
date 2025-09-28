// Fallback data for testing when server doesn't work
const FALLBACK_DATA = {
    'NFL_easy': [
        {
            "id": "nfl_patrick_mahomes",
            "name": "Patrick Mahomes",
            "league": "NFL",
            "team": "KC",
            "college": "Texas Tech",
            "jersey_current": 15,
            "jerseys": [15],
            "positions": ["QB"],
            "from": 2017,
            "to": 2024,
            "tier": "easy"
        },
        {
            "id": "nfl_tom_brady",
            "name": "Tom Brady",
            "league": "NFL", 
            "team": "TB",
            "college": "Michigan",
            "jersey_current": 12,
            "jerseys": [12],
            "positions": ["QB"],
            "from": 2000,
            "to": 2022,
            "tier": "easy"
        },
        {
            "id": "nfl_aaron_donald",
            "name": "Aaron Donald",
            "league": "NFL",
            "team": "LAR", 
            "college": "Pittsburgh",
            "jersey_current": 99,
            "jerseys": [99],
            "positions": ["DT"],
            "from": 2014,
            "to": 2023,
            "tier": "easy"
        },
        {
            "id": "nfl_josh_allen",
            "name": "Josh Allen",
            "league": "NFL",
            "team": "BUF",
            "college": "Wyoming",
            "jersey_current": 17,
            "jerseys": [17],
            "positions": ["QB"],
            "from": 2018,
            "to": 2024,
            "tier": "easy"
        },
        {
            "id": "nfl_cooper_kupp",
            "name": "Cooper Kupp",
            "league": "NFL",
            "team": "LAR",
            "college": "Eastern Washington",
            "jersey_current": 10,
            "jerseys": [10],
            "positions": ["WR"],
            "from": 2017,
            "to": 2024,
            "tier": "easy"
        }
    ],
    'NFL_medium': [
        {
            "id": "nfl_travis_kelce",
            "name": "Travis Kelce",
            "league": "NFL",
            "team": "KC",
            "college": "Cincinnati",
            "jersey_current": 87,
            "jerseys": [87],
            "positions": ["TE"],
            "from": 2013,
            "to": 2024,
            "tier": "medium"
        },
        {
            "id": "nfl_davante_adams",
            "name": "Davante Adams",
            "league": "NFL",
            "team": "LV",
            "college": "Fresno State",
            "jersey_current": 17,
            "jerseys": [17],
            "positions": ["WR"],
            "from": 2014,
            "to": 2024,
            "tier": "medium"
        },
        {
            "id": "nfl_derrick_henry",
            "name": "Derrick Henry",
            "league": "NFL",
            "team": "BAL",
            "college": "Alabama",
            "jersey_current": 22,
            "jerseys": [22],
            "positions": ["RB"],
            "from": 2016,
            "to": 2024,
            "tier": "medium"
        }
    ],
    'NFL_hard': [
        {
            "id": "nfl_joe_burrow",
            "name": "Joe Burrow",
            "league": "NFL",
            "team": "CIN",
            "college": "LSU",
            "jersey_current": 9,
            "jerseys": [9],
            "positions": ["QB"],
            "from": 2020,
            "to": 2024,
            "tier": "hard"
        },
        {
            "id": "nfl_justin_jefferson",
            "name": "Justin Jefferson",
            "league": "NFL",
            "team": "MIN",
            "college": "LSU",
            "jersey_current": 18,
            "jerseys": [18],
            "positions": ["WR"],
            "from": 2020,
            "to": 2024,
            "tier": "hard"
        },
        {
            "id": "nfl_jonathan_taylor",
            "name": "Jonathan Taylor",
            "league": "NFL",
            "team": "IND",
            "college": "Wisconsin",
            "jersey_current": 28,
            "jerseys": [28],
            "positions": ["RB"],
            "from": 2020,
            "to": 2024,
            "tier": "hard"
        }
    ]
};

// Export for use in dataLoader
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FALLBACK_DATA;
} else {
    window.FALLBACK_DATA = FALLBACK_DATA;
}
