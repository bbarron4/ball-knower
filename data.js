// Ball Knower - Enhanced NFL Player Data with Visual Elements

// College logos and images (using placeholder URLs - in production, use actual college logos)
const collegeData = {
    // SEC Conference
    "University of Alabama": {
        name: "University of Alabama",
        nickname: "Crimson Tide",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/C41E3A/FFFFFF?text=BAMA",
        color: "#C41E3A"
    },
    "University of Georgia": {
        name: "University of Georgia",
        nickname: "Bulldogs",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=UGA",
        color: "#CC0000"
    },
    "Louisiana State University": {
        name: "Louisiana State University",
        nickname: "Tigers",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/461D7C/FFD700?text=LSU",
        color: "#461D7C"
    },
    "University of Florida": {
        name: "University of Florida",
        nickname: "Gators",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/0021A5/FF6600?text=UF",
        color: "#0021A5"
    },
    "Auburn University": {
        name: "Auburn University",
        nickname: "Tigers",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/0C2340/FF6600?text=AU",
        color: "#0C2340"
    },
    "University of Tennessee": {
        name: "University of Tennessee",
        nickname: "Volunteers",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/FF8200/FFFFFF?text=UT",
        color: "#FF8200"
    },
    "Texas A&M University": {
        name: "Texas A&M University",
        nickname: "Aggies",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/500000/FFFFFF?text=TAMU",
        color: "#500000"
    },
    "University of South Carolina": {
        name: "University of South Carolina",
        nickname: "Gamecocks",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/73000A/FFFFFF?text=USC",
        color: "#73000A"
    },
    "University of Kentucky": {
        name: "University of Kentucky",
        nickname: "Wildcats",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/0033A0/FFFFFF?text=UK",
        color: "#0033A0"
    },
    "University of Arkansas": {
        name: "University of Arkansas",
        nickname: "Razorbacks",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/9D2235/FFFFFF?text=ARK",
        color: "#9D2235"
    },
    "University of Mississippi": {
        name: "University of Mississippi",
        nickname: "Rebels",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/CE1126/FFFFFF?text=OM",
        color: "#CE1126"
    },
    "Mississippi State University": {
        name: "Mississippi State University",
        nickname: "Bulldogs",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/660000/FFFFFF?text=MSU",
        color: "#660000"
    },
    "Vanderbilt University": {
        name: "Vanderbilt University",
        nickname: "Commodores",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/866D4B/000000?text=VU",
        color: "#866D4B"
    },
    "University of Missouri": {
        name: "University of Missouri",
        nickname: "Tigers",
        conference: "SEC",
        logo: "https://via.placeholder.com/100x100/F1B82D/000000?text=MU",
        color: "#F1B82D"
    },

    // Big Ten Conference
    "Ohio State University": {
        name: "Ohio State University",
        nickname: "Buckeyes",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/BB0000/FFFFFF?text=OSU",
        color: "#BB0000"
    },
    "University of Michigan": {
        name: "University of Michigan",
        nickname: "Wolverines",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/FFD700/000000?text=M",
        color: "#FFD700"
    },
    "Pennsylvania State University": {
        name: "Pennsylvania State University",
        nickname: "Nittany Lions",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/041E42/FFFFFF?text=PSU",
        color: "#041E42"
    },
    "University of Wisconsin": {
        name: "University of Wisconsin",
        nickname: "Badgers",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/C41E3A/FFFFFF?text=WIS",
        color: "#C41E3A"
    },
    "Michigan State University": {
        name: "Michigan State University",
        nickname: "Spartans",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/18453B/FFFFFF?text=MSU",
        color: "#18453B"
    },
    "University of Iowa": {
        name: "University of Iowa",
        nickname: "Hawkeyes",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/FFCD00/000000?text=UI",
        color: "#FFCD00"
    },
    "University of Minnesota": {
        name: "University of Minnesota",
        nickname: "Golden Gophers",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/7A0019/FFCC33?text=UM",
        color: "#7A0019"
    },
    "University of Nebraska": {
        name: "University of Nebraska",
        nickname: "Cornhuskers",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/D00000/FFFFFF?text=UN",
        color: "#D00000"
    },
    "Indiana University": {
        name: "Indiana University",
        nickname: "Hoosiers",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/990000/FFFFFF?text=IU",
        color: "#990000"
    },
    "Purdue University": {
        name: "Purdue University",
        nickname: "Boilermakers",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/CEB888/000000?text=PU",
        color: "#CEB888"
    },
    "University of Illinois": {
        name: "University of Illinois",
        nickname: "Fighting Illini",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/E84A27/FFFFFF?text=UI",
        color: "#E84A27"
    },
    "Northwestern University": {
        name: "Northwestern University",
        nickname: "Wildcats",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/4E2A84/FFFFFF?text=NU",
        color: "#4E2A84"
    },
    "University of Maryland": {
        name: "University of Maryland",
        nickname: "Terrapins",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/E03A3E/FFFFFF?text=UM",
        color: "#E03A3E"
    },
    "Rutgers University": {
        name: "Rutgers University",
        nickname: "Scarlet Knights",
        conference: "Big Ten",
        logo: "https://via.placeholder.com/100x100/CC0033/FFFFFF?text=RU",
        color: "#CC0033"
    },

    // ACC Conference
    "Clemson University": {
        name: "Clemson University",
        nickname: "Tigers",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/F56600/FFFFFF?text=CU",
        color: "#F56600"
    },
    "University of Miami": {
        name: "University of Miami",
        nickname: "Hurricanes",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/F47321/FFFFFF?text=UM",
        color: "#F47321"
    },
    "Florida State University": {
        name: "Florida State University",
        nickname: "Seminoles",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/782F40/CEB888?text=FSU",
        color: "#782F40"
    },
    "University of North Carolina": {
        name: "University of North Carolina",
        nickname: "Tar Heels",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/4B9CD3/FFFFFF?text=UNC",
        color: "#4B9CD3"
    },
    "Duke University": {
        name: "Duke University",
        nickname: "Blue Devils",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/001A57/FFFFFF?text=DU",
        color: "#001A57"
    },
    "Virginia Tech": {
        name: "Virginia Tech",
        nickname: "Hokies",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/861F41/FFFFFF?text=VT",
        color: "#861F41"
    },
    "University of Virginia": {
        name: "University of Virginia",
        nickname: "Cavaliers",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/232D4B/F84C1E?text=UVA",
        color: "#232D4B"
    },
    "University of Pittsburgh": {
        name: "University of Pittsburgh", 
        nickname: "Panthers",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/003366/FFFFFF?text=PITT",
        color: "#003366"
    },
    "University of Louisville": {
        name: "University of Louisville",
        nickname: "Cardinals",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/AD0000/FFFFFF?text=LOU",
        color: "#AD0000"
    },
    "North Carolina State University": {
        name: "North Carolina State University",
        nickname: "Wolfpack",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=NCSU",
        color: "#CC0000"
    },
    "Georgia Tech": {
        name: "Georgia Tech",
        nickname: "Yellow Jackets",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/B3A369/FFFFFF?text=GT",
        color: "#B3A369"
    },
    "Wake Forest University": {
        name: "Wake Forest University",
        nickname: "Demon Deacons",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/9E7E38/000000?text=WF",
        color: "#9E7E38"
    },
    "Boston College": {
        name: "Boston College",
        nickname: "Eagles",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/8B0000/FFFFFF?text=BC",
        color: "#8B0000"
    },
    "Syracuse University": {
        name: "Syracuse University",
        nickname: "Orange",
        conference: "ACC",
        logo: "https://via.placeholder.com/100x100/F76900/FFFFFF?text=SU",
        color: "#F76900"
    },

    // Big 12 Conference
    "University of Texas": {
        name: "University of Texas",
        nickname: "Longhorns",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/BF5700/FFFFFF?text=UT",
        color: "#BF5700"
    },
    "University of Oklahoma": {
        name: "University of Oklahoma",
        nickname: "Sooners",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/841617/FFFFFF?text=OU",
        color: "#841617"
    },
    "Texas Tech University": {
        name: "Texas Tech University",
        nickname: "Red Raiders",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=TTU",
        color: "#CC0000"
    },
    "University of Cincinnati": {
        name: "University of Cincinnati",
        nickname: "Bearcats",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/C8102E/FFFFFF?text=UC",
        color: "#C8102E"
    },
    "Baylor University": {
        name: "Baylor University",
        nickname: "Bears",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/003015/FFD700?text=BU",
        color: "#003015"
    },
    "Oklahoma State University": {
        name: "Oklahoma State University",
        nickname: "Cowboys",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/FF6600/000000?text=OSU",
        color: "#FF6600"
    },
    "Kansas State University": {
        name: "Kansas State University",
        nickname: "Wildcats",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/512888/FFFFFF?text=KSU",
        color: "#512888"
    },
    "University of Kansas": {
        name: "University of Kansas",
        nickname: "Jayhawks",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/0051BA/FFFFFF?text=KU",
        color: "#0051BA"
    },
    "Texas Christian University": {
        name: "Texas Christian University",
        nickname: "Horned Frogs",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/4D1979/FFFFFF?text=TCU",
        color: "#4D1979"
    },
    "West Virginia University": {
        name: "West Virginia University",
        nickname: "Mountaineers",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/002855/FFD700?text=WVU",
        color: "#002855"
    },
    "Iowa State University": {
        name: "Iowa State University",
        nickname: "Cyclones",
        conference: "Big 12",
        logo: "https://via.placeholder.com/100x100/C8102E/FFD700?text=ISU",
        color: "#C8102E"
    },

    // Pac-12 Conference
    "University of Southern California": {
        name: "University of Southern California",
        nickname: "Trojans",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/990000/FFD700?text=USC",
        color: "#990000"
    },
    "University of California, Berkeley": {
        name: "University of California, Berkeley",
        nickname: "Golden Bears",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/003262/FFD700?text=CAL",
        color: "#003262"
    },
    "Stanford University": {
        name: "Stanford University",
        nickname: "Cardinal",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/8C1515/FFFFFF?text=STAN",
        color: "#8C1515"
    },
    "University of Washington": {
        name: "University of Washington",
        nickname: "Huskies",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/4B2E83/FFD700?text=UW",
        color: "#4B2E83"
    },
    "University of Oregon": {
        name: "University of Oregon",
        nickname: "Ducks",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/154733/FFD700?text=UO",
        color: "#154733"
    },
    "University of California, Los Angeles": {
        name: "University of California, Los Angeles",
        nickname: "Bruins",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/2D68C4/FFD700?text=UCLA",
        color: "#2D68C4"
    },
    "Arizona State University": {
        name: "Arizona State University",
        nickname: "Sun Devils",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/8C1538/FFD700?text=ASU",
        color: "#8C1538"
    },
    "University of Arizona": {
        name: "University of Arizona",
        nickname: "Wildcats",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/003366/CC0000?text=UA",
        color: "#003366"
    },
    "University of Utah": {
        name: "University of Utah",
        nickname: "Utes",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=UU",
        color: "#CC0000"
    },
    "University of Colorado": {
        name: "University of Colorado",
        nickname: "Buffaloes",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/000000/CFB87C?text=CU",
        color: "#000000"
    },
    "Oregon State University": {
        name: "Oregon State University",
        nickname: "Beavers",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/DC4405/FFFFFF?text=OSU",
        color: "#DC4405"
    },
    "Washington State University": {
        name: "Washington State University",
        nickname: "Cougars",
        conference: "Pac-12",
        logo: "https://via.placeholder.com/100x100/981E32/FFFFFF?text=WSU",
        color: "#981E32"
    },

    // Mountain West and Other Conferences
    "Fresno State University": {
        name: "Fresno State University",
        nickname: "Bulldogs",
        conference: "Mountain West",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=FS",
        color: "#CC0000"
    },
    "University of Wyoming": {
        name: "University of Wyoming",
        nickname: "Cowboys",
        conference: "Mountain West",
        logo: "https://via.placeholder.com/100x100/8B0000/FFFFFF?text=WYO",
        color: "#8B0000"
    },
    "Boise State University": {
        name: "Boise State University",
        nickname: "Broncos",
        conference: "Mountain West",
        logo: "https://via.placeholder.com/100x100/0033A0/FF6600?text=BSU",
        color: "#0033A0"
    },
    "San Diego State University": {
        name: "San Diego State University",
        nickname: "Aztecs",
        conference: "Mountain West",
        logo: "https://via.placeholder.com/100x100/CC0000/000000?text=SDSU",
        color: "#CC0000"
    },
    "Eastern Washington University": {
        name: "Eastern Washington University",
        nickname: "Eagles", 
        conference: "Big Sky",
        logo: "https://via.placeholder.com/100x100/CC0000/FFFFFF?text=EWU",
        color: "#CC0000"
    },
    "West Alabama University": {
        name: "West Alabama University",
        nickname: "Tigers",
        conference: "Gulf South",
        logo: "https://via.placeholder.com/100x100/FF6600/FFFFFF?text=UWA",
        color: "#FF6600"
    },
    "University of Notre Dame": {
        name: "University of Notre Dame",
        nickname: "Fighting Irish",
        conference: "Independent",
        logo: "https://via.placeholder.com/100x100/0C2340/C99700?text=ND",
        color: "#0C2340"
    },
    "Brigham Young University": {
        name: "Brigham Young University",
        nickname: "Cougars",
        conference: "Independent",
        logo: "https://via.placeholder.com/100x100/002E5D/FFFFFF?text=BYU",
        color: "#002E5D"
    }
    
};

// Team data with championship counts and visual elements
const teamData = {
    "Tampa Bay Buccaneers": {
        name: "Tampa Bay Buccaneers",
        conference: "NFC",
        division: "South",
        championships: 2,
        superBowls: [2002, 2020],
        logo: "https://via.placeholder.com/120x120/FF4500/FFFFFF?text=TB",
        colors: ["#FF4500", "#FFFFFF"],
        founded: 1976
    },
    "Los Angeles Rams": {
        name: "Los Angeles Rams",
        conference: "NFC", 
        division: "West",
        championships: 2,
        superBowls: [1999, 2021],
        logo: "https://via.placeholder.com/120x120/003594/FFFFFF?text=LAR",
        colors: ["#003594", "#FFFFFF"],
        founded: 1937
    },
    "Buffalo Bills": {
        name: "Buffalo Bills",
        conference: "AFC",
        division: "East", 
        championships: 2,
        superBowls: [],
        logo: "https://via.placeholder.com/120x120/00338D/FFFFFF?text=BUF",
        colors: ["#00338D", "#FFFFFF"],
        founded: 1960
    },
    "Tennessee Titans": {
        name: "Tennessee Titans",
        conference: "AFC",
        division: "South",
        championships: 2,
        superBowls: [],
        logo: "https://via.placeholder.com/120x120/0C2340/FFFFFF?text=TEN",
        colors: ["#0C2340", "#FFFFFF"],
        founded: 1960
    },
    "Kansas City Chiefs": {
        name: "Kansas City Chiefs",
        conference: "AFC",
        division: "West",
        championships: 4,
        superBowls: [1969, 2019, 2022],
        logo: "https://via.placeholder.com/120x120/E31837/FFFFFF?text=KC",
        colors: ["#E31837", "#FFFFFF"],
        founded: 1960
    },
    "Dallas Cowboys": {
        name: "Dallas Cowboys",
        conference: "NFC",
        division: "East",
        championships: 5,
        superBowls: [1971, 1977, 1992, 1993, 1995],
        logo: "https://via.placeholder.com/120x120/003594/FFFFFF?text=DAL",
        colors: ["#003594", "#FFFFFF"],
        founded: 1960
    },
    "Las Vegas Raiders": {
        name: "Las Vegas Raiders",
        conference: "AFC",
        division: "West",
        championships: 3,
        superBowls: [1976, 1980, 1983],
        logo: "https://via.placeholder.com/120x120/000000/FFFFFF?text=LV",
        colors: ["#000000", "#FFFFFF"],
        founded: 1960
    },
    "Miami Dolphins": {
        name: "Miami Dolphins",
        conference: "AFC",
        division: "East",
        championships: 2,
        superBowls: [1972, 1973],
        logo: "https://via.placeholder.com/120x120/008E97/FFFFFF?text=MIA",
        colors: ["#008E97", "#FFFFFF"],
        founded: 1966
    },
    "Baltimore Ravens": {
        name: "Baltimore Ravens",
        conference: "AFC",
        division: "North",
        championships: 2,
        superBowls: [2000, 2012],
        logo: "https://via.placeholder.com/120x120/241773/FFFFFF?text=BAL",
        colors: ["#241773", "#FFFFFF"],
        founded: 1996
    },
    "New York Jets": {
        name: "New York Jets",
        conference: "AFC",
        division: "East",
        championships: 1,
        superBowls: [1968],
        logo: "https://via.placeholder.com/120x120/125740/FFFFFF?text=NYJ",
        colors: ["#125740", "#FFFFFF"],
        founded: 1960
    },
    "San Francisco 49ers": {
        name: "San Francisco 49ers",
        conference: "NFC",
        division: "West",
        championships: 5,
        superBowls: [1981, 1984, 1988, 1989, 1994],
        logo: "https://via.placeholder.com/120x120/AA0000/FFFFFF?text=SF",
        colors: ["#AA0000", "#FFFFFF"],
        founded: 1946
    },
    "Pittsburgh Steelers": {
        name: "Pittsburgh Steelers",
        conference: "AFC",
        division: "North",
        championships: 6,
        superBowls: [1974, 1975, 1978, 1979, 2005, 2008],
        logo: "https://via.placeholder.com/120x120/FFB612/FFFFFF?text=PIT",
        colors: ["#FFB612", "#FFFFFF"],
        founded: 1933
    },
    "Minnesota Vikings": {
        name: "Minnesota Vikings",
        conference: "NFC",
        division: "North",
        championships: 0,
        superBowls: [],
        logo: "https://via.placeholder.com/120x120/4F2683/FFFFFF?text=MIN",
        colors: ["#4F2683", "#FFFFFF"],
        founded: 1961
    }
};

// Enhanced player data with popularity ratings (1-5 scale, 5 being most popular)
const playerData = {
    nfl: [
        {
            name: "Tom Brady",
            team: "Tampa Bay Buccaneers",
            position: "Quarterback",
            jerseyNumber: "12",
            popularity: 5,
            college: "University of Michigan",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            facts: [
                "Has won 7 Super Bowl rings (most in NFL history)",
                "Drafted 199th overall in 2000 (6th round)",
                "Played in 10 Super Bowls (most in NFL history)",
                "Has 649 career touchdown passes (2nd all-time)",
                "Was 43 years old when he won Super Bowl LV (oldest QB to win)",
                "Led the Patriots to 6 Super Bowl victories",
                "Won 3 NFL MVP awards",
                "Has thrown for over 84,000 career yards (most in NFL history)",
                "Won Super Bowl MVP 5 times (most in NFL history)",
                "Never had a losing season as a starter"
            ]
        },
        {
            name: "Patrick Mahomes",
            team: "Kansas City Chiefs",
            position: "Quarterback",
            jerseyNumber: "15",
            popularity: 5,
            college: "Texas Tech University",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            facts: [
                "Has won 2 Super Bowls with the Chiefs",
                "Won Super Bowl MVP in 2020",
                "Won NFL MVP in 2018 (his first season starting)",
                "Led the Chiefs to 4 consecutive AFC Championship Games",
                "Has thrown for 50+ touchdowns in a season (2018)",
                "Won NFL Offensive Player of the Year in 2018",
                "Has made 5 Pro Bowls",
                "Led Texas Tech to bowl games",
                "Son of former MLB pitcher Pat Mahomes",
                "Known for his no-look passes"
            ]
        },
        {
            name: "Aaron Donald",
            team: "Los Angeles Rams",
            position: "Defensive Tackle",
            jerseyNumber: "99",
            popularity: 4,
            college: "University of Pittsburgh",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
            facts: [
                "Has won 3 Defensive Player of the Year awards (tied for most)",
                "Won Super Bowl LVI with the Rams",
                "Has recorded over 100 career sacks",
                "Has made 8 Pro Bowls",
                "Won NFL Defensive Rookie of the Year in 2014",
                "Is considered one of the best defensive players ever",
                "Drafted 13th overall in 2014",
                "Has led the NFL in sacks multiple times",
                "Known for his incredible speed for a defensive tackle",
                "Won NFC Defensive Player of the Year multiple times"
            ]
        },
        {
            name: "Josh Allen",
            team: "Buffalo Bills",
            position: "Quarterback",
            jerseyNumber: "17",
            popularity: 4,
            college: "University of Wyoming",
            facts: [
                "Attended University of Wyoming",
                "Drafted 7th overall in 2018",
                "Was born in Firebaugh, California",
                "Is 6'5\" tall and weighs 237 pounds",
                "Has thrown for over 18,000 career yards",
                "Led the Bills to AFC Championship Game",
                "Has 37 rushing touchdowns in his career",
                "Was a walk-on at Wyoming",
                "Has made 3 Pro Bowls"
            ]
        },
        {
            name: "Derrick Henry",
            team: "Tennessee Titans",
            position: "Running Back",
            jerseyNumber: "22",
            popularity: 4,
            college: "University of Alabama",
            facts: [
                "Attended University of Alabama",
                "Drafted 45th overall in 2016",
                "Won the Heisman Trophy in 2015",
                "Was born in Yulee, Florida",
                "Is 6'3\" tall and weighs 247 pounds",
                "Has rushed for over 8,000 career yards",
                "Led the NFL in rushing twice",
                "Has 80 career rushing touchdowns",
                "Won 2 national championships at Alabama"
            ]
        },
        {
            name: "Travis Kelce",
            team: "Kansas City Chiefs",
            position: "Tight End",
            jerseyNumber: "87",
            popularity: 4,
            college: "University of Cincinnati",
            facts: [
                "Attended University of Cincinnati",
                "Drafted 63rd overall in 2013",
                "Has caught over 8,000 career yards",
                "Was born in Westlake, Ohio",
                "Is 6'5\" tall and weighs 260 pounds",
                "Has made 8 Pro Bowls",
                "Won 2 Super Bowls with the Chiefs",
                "Has 69 career touchdown catches",
                "Is known for his touchdown celebrations"
            ]
        },
        {
            name: "Cooper Kupp",
            team: "Los Angeles Rams",
            position: "Wide Receiver",
            jerseyNumber: "10",
            popularity: 3,
            college: "Eastern Washington University",
            facts: [
                "Attended Eastern Washington University",
                "Drafted 69th overall in 2017",
                "Won the receiving triple crown in 2021",
                "Was born in Yakima, Washington",
                "Caught 145 passes in 2021 season",
                "Won Super Bowl MVP in 2022",
                "Is 6'2\" tall and weighs 208 pounds",
                "Had 1,947 receiving yards in 2021",
                "Was an FCS All-American in college"
            ]
        },
        {
            name: "Travis Kelce",
            team: "Kansas City Chiefs",
            position: "Tight End",
            jerseyNumber: "87",
            facts: [
                "Attended University of Cincinnati",
                "Drafted 63rd overall in 2013",
                "Has caught over 8,000 career yards",
                "Was born in Westlake, Ohio",
                "Is 6'5\" tall and weighs 260 pounds",
                "Has made 8 Pro Bowls",
                "Won 2 Super Bowls with the Chiefs",
                "Has 69 career touchdown catches",
                "Is known for his touchdown celebrations"
            ]
        },
        {
            name: "Dak Prescott",
            team: "Dallas Cowboys",
            position: "Quarterback",
            jerseyNumber: "4",
            facts: [
                "Attended Mississippi State University",
                "Drafted 135th overall in 2016",
                "Was born in Sulphur, Louisiana",
                "Is 6'2\" tall and weighs 238 pounds",
                "Has thrown for over 24,000 career yards",
                "Won NFL Offensive Rookie of the Year in 2016",
                "Has made 2 Pro Bowls",
                "Led Mississippi State to #1 ranking in 2014",
                "Has 28 career rushing touchdowns"
            ]
        },
        {
            name: "Davante Adams",
            team: "Las Vegas Raiders",
            position: "Wide Receiver",
            jerseyNumber: "17",
            facts: [
                "Attended Fresno State University",
                "Drafted 53rd overall in 2014",
                "Was born in East Palo Alto, California",
                "Is 6'1\" tall and weighs 215 pounds",
                "Has caught over 8,000 career yards",
                "Has made 6 Pro Bowls",
                "Caught 123 passes in 2021 season",
                "Was teammates with Derek Carr at Fresno State",
                "Has 87 career touchdown catches"
            ]
        },
        {
            name: "Patrick Mahomes",
            team: "Kansas City Chiefs",
            position: "Quarterback",
            jerseyNumber: "15",
            facts: [
                "Attended Texas Tech University",
                "Drafted 10th overall in 2017",
                "Has won 2 Super Bowls with the Chiefs",
                "Was born in Tyler, Texas",
                "Is 6'3\" tall and weighs 230 pounds",
                "Has thrown for over 24,000 career yards",
                "Won Super Bowl MVP in 2020",
                "Has made 5 Pro Bowls",
                "Led Texas Tech to bowl games"
            ]
        },
        {
            name: "Tyreek Hill",
            team: "Miami Dolphins",
            position: "Wide Receiver",
            jerseyNumber: "10",
            facts: [
                "Attended West Alabama University",
                "Drafted 165th overall in 2016",
                "Was born in Lauderhill, Florida",
                "Is 5'10\" tall and weighs 185 pounds",
                "Has caught over 8,000 career yards",
                "Has made 7 Pro Bowls",
                "Known for his incredible speed",
                "Has 76 career touchdown catches",
                "Was originally a running back in college"
            ]
        },
        {
            name: "Lamar Jackson",
            team: "Baltimore Ravens",
            position: "Quarterback",
            jerseyNumber: "8",
            facts: [
                "Attended University of Louisville",
                "Drafted 32nd overall in 2018",
                "Has won 1 MVP award",
                "Was born in Pompano Beach, Florida",
                "Is 6'2\" tall and weighs 212 pounds",
                "Has thrown for over 12,000 career yards",
                "Has 4,000+ rushing yards in his career",
                "Has made 2 Pro Bowls",
                "Won Heisman Trophy in 2016"
            ]
        },
        {
            name: "Aaron Rodgers",
            team: "New York Jets",
            position: "Quarterback",
            jerseyNumber: "8",
            facts: [
                "Attended University of California, Berkeley",
                "Drafted 24th overall in 2005",
                "Has won 4 MVP awards",
                "Was born in Chico, California",
                "Is 6'2\" tall and weighs 225 pounds",
                "Has thrown for over 59,000 career yards",
                "Won Super Bowl XLV with the Packers",
                "Has made 10 Pro Bowls",
                "Has 475 career touchdown passes"
            ]
        },
        {
            name: "Christian McCaffrey",
            team: "San Francisco 49ers",
            position: "Running Back",
            jerseyNumber: "23",
            facts: [
                "Attended Stanford University",
                "Drafted 8th overall in 2017",
                "Was born in Castle Rock, Colorado",
                "Is 5'11\" tall and weighs 205 pounds",
                "Has rushed for over 6,000 career yards",
                "Has made 3 Pro Bowls",
                "Son of former NFL player Ed McCaffrey",
                "Has 65 career touchdowns",
                "Won Pac-12 Player of the Year in 2015"
            ]
        },
        {
            name: "T.J. Watt",
            team: "Pittsburgh Steelers",
            position: "Linebacker",
            jerseyNumber: "90",
            facts: [
                "Attended University of Wisconsin",
                "Drafted 30th overall in 2017",
                "Has won 1 Defensive Player of the Year award",
                "Was born in Pewaukee, Wisconsin",
                "Is 6'4\" tall and weighs 252 pounds",
                "Has recorded over 80 career sacks",
                "Has made 5 Pro Bowls",
                "Brother of J.J. Watt",
                "Led NFL in sacks in 2021"
            ]
        },
        {
            name: "Justin Jefferson",
            team: "Minnesota Vikings",
            position: "Wide Receiver",
            jerseyNumber: "18",
            facts: [
                "Attended Louisiana State University",
                "Drafted 22nd overall in 2020",
                "Was born in St. Rose, Louisiana",
                "Is 6'1\" tall and weighs 195 pounds",
                "Has caught over 5,000 career yards",
                "Has made 3 Pro Bowls",
                "Caught 128 passes in 2022 season",
                "Won national championship at LSU in 2019",
                "Has 32 career touchdown catches"
            ]
        }
    ]
};

// Game configuration
const gameConfig = {
    questionsPerGame: 10,
    timePerQuestion: 30,
    easyQuestions: 3,
    mediumQuestions: 4,
    hardQuestions: 3
};

// Question templates for different types
const questionTemplates = {
    college: "What college did {name} attend?",
    draft: "What round was {name} drafted in?",
    position: "What position does {name} play?",
    height: "How tall is {name}?",
    jersey: "What jersey number does {name} wear?",
    birthplace: "Where was {name} born?",
    championships: "How many championships has {name} won?",
    team: "What team does {name} currently play for?",
    awards: "What major award has {name} won?",
    nickname: "What is {name}'s nickname?"
};

// Enhanced game modes - focused on three core modes
const gameModes = {
    'jersey-guesser': {
        name: 'Jersey Number Guesser',
        description: 'Guess a player\'s jersey number',
        icon: 'fas fa-tshirt',
        timeLimit: 30,
        questions: 10,
        hasImages: true,
        imageType: 'jersey'
    },
    'college-guesser': {
        name: 'College Guesser',
        description: 'Guess which college a player attended',
        icon: 'fas fa-university',
        timeLimit: 30,
        questions: 10,
        hasImages: true,
        imageType: 'college'
    },
    'achievement-guesser': {
        name: 'Achievement Guesser',
        description: 'Compare players\' Pro Bowls, Super Bowls, and MVPs',
        icon: 'fas fa-trophy',
        timeLimit: 30,
        questions: 10,
        hasImages: true,
        imageType: 'achievement'
    },
    'survival': {
        name: 'Survival Mode',
        description: 'Keep going until you get one wrong!',
        icon: 'fas fa-fire',
        timeLimit: 20,
        questions: null,
        hasImages: true
    },
    'multiplayer': {
        name: 'Multiplayer',
        description: 'Compete against friends in real-time',
        icon: 'fas fa-users',
        timeLimit: 30,
        questions: 10,
        hasImages: true
    }
};

// Achievements system
const achievements = {
    'first-win': {
        name: 'First Victory',
        description: 'Win your first game',
        icon: 'fas fa-trophy',
        condition: (stats) => stats.gamesWon >= 1,
        rarity: 'common'
    },
    'perfect-game': {
        name: 'Perfect Game',
        description: 'Get 100% on a game',
        icon: 'fas fa-star',
        condition: (stats) => stats.perfectGames >= 1,
        rarity: 'rare'
    },
    'streak-master': {
        name: 'Streak Master',
        description: 'Get a 10-question streak',
        icon: 'fas fa-fire',
        condition: (stats) => stats.bestStreak >= 10,
        rarity: 'epic'
    },
    'speed-demon': {
        name: 'Speed Demon',
        description: 'Complete a blitz mode game',
        icon: 'fas fa-bolt',
        condition: (stats) => stats.blitzGames >= 1,
        rarity: 'rare'
    },
    'survivor': {
        name: 'Survivor',
        description: 'Survive 20 questions in survival mode',
        icon: 'fas fa-skull-crossbones',
        condition: (stats) => stats.survivalRecord >= 20,
        rarity: 'legendary'
    },
    'multiplayer-master': {
        name: 'Multiplayer Master',
        description: 'Win 5 multiplayer games',
        icon: 'fas fa-users',
        condition: (stats) => stats.multiplayerWins >= 5,
        rarity: 'epic'
    },
    'jersey-expert': {
        name: 'Jersey Expert',
        description: 'Get 10 jersey number questions correct',
        icon: 'fas fa-tshirt',
        condition: (stats) => stats.jerseyCorrect >= 10,
        rarity: 'uncommon'
    },
    'college-expert': {
        name: 'College Expert',
        description: 'Get 15 college questions correct',
        icon: 'fas fa-university',
        condition: (stats) => stats.collegeCorrect >= 15,
        rarity: 'uncommon'
    },
    'team-expert': {
        name: 'Team Expert',
        description: 'Get 10 team questions correct',
        icon: 'fas fa-trophy',
        condition: (stats) => stats.teamCorrect >= 10,
        rarity: 'uncommon'
    },
    'dedicated': {
        name: 'Dedicated Player',
        description: 'Play 50 games total',
        icon: 'fas fa-medal',
        condition: (stats) => stats.totalGames >= 50,
        rarity: 'rare'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { playerData, gameConfig, questionTemplates };
}
