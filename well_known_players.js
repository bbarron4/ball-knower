// Well-known NFL players from Excel file
const WELL_KNOWN_PLAYERS = [
  {
    "id": "nfl_tom_brady",
    "name": "Tom Brady",
    "team": "Tampa Bay Buccaneers",
    "college": "Michigan",
    "jersey": 12,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_peyton_manning",
    "name": "Peyton Manning",
    "team": "Denver Broncos",
    "college": "Tennessee",
    "jersey": 18,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_drew_brees",
    "name": "Drew Brees",
    "team": "New Orleans Saints",
    "college": "Purdue",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_aaron_rodgers",
    "name": "Aaron Rodgers",
    "team": "New York Jets",
    "college": "California",
    "jersey": 12,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_patrick_mahomes",
    "name": "Patrick Mahomes",
    "team": "Kansas City Chiefs",
    "college": "Texas Tech",
    "jersey": 15,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_russell_wilson",
    "name": "Russell Wilson",
    "team": "Denver Broncos",
    "college": "Wisconsin",
    "jersey": 3,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_ben_roethlisberger",
    "name": "Ben Roethlisberger",
    "team": "Pittsburgh Steelers",
    "college": "Miami (OH)",
    "jersey": 7,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_eli_manning",
    "name": "Eli Manning",
    "team": "New York Giants",
    "college": "Ole Miss",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_philip_rivers",
    "name": "Philip Rivers",
    "team": "Indianapolis Colts",
    "college": "NC State",
    "jersey": 17,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_tony_romo",
    "name": "Tony Romo",
    "team": "Dallas Cowboys",
    "college": "Eastern Illinois",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_cam_newton",
    "name": "Cam Newton",
    "team": "Carolina Panthers",
    "college": "Auburn",
    "jersey": 1,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_andrew_luck",
    "name": "Andrew Luck",
    "team": "Indianapolis Colts",
    "college": "Stanford",
    "jersey": 12,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_matthew_stafford",
    "name": "Matthew Stafford",
    "team": "Los Angeles Rams",
    "college": "Georgia",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_matt_ryan",
    "name": "Matt Ryan",
    "team": "Indianapolis Colts",
    "college": "Boston College",
    "jersey": 2,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_lamar_jackson",
    "name": "Lamar Jackson",
    "team": "Baltimore Ravens",
    "college": "Louisville",
    "jersey": 8,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_josh_allen",
    "name": "Josh Allen",
    "team": "Buffalo Bills",
    "college": "Wyoming",
    "jersey": 17,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_justin_herbert",
    "name": "Justin Herbert",
    "team": "Los Angeles Chargers",
    "college": "Oregon",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_joe_burrow",
    "name": "Joe Burrow",
    "team": "Cincinnati Bengals",
    "college": "LSU",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_trevor_lawrence",
    "name": "Trevor Lawrence",
    "team": "Jacksonville Jaguars",
    "college": "Clemson",
    "jersey": 16,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jalen_hurts",
    "name": "Jalen Hurts",
    "team": "Philadelphia Eagles",
    "college": "Oklahoma",
    "jersey": 1,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_dak_prescott",
    "name": "Dak Prescott",
    "team": "Dallas Cowboys",
    "college": "Mississippi State",
    "jersey": 4,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_colin_kaepernick",
    "name": "Colin Kaepernick",
    "team": "San Francisco 49ers",
    "college": "Nevada",
    "jersey": 7,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_deshaun_watson",
    "name": "Deshaun Watson",
    "team": "Cleveland Browns",
    "college": "Clemson",
    "jersey": 4,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_tim_tebow",
    "name": "Tim Tebow",
    "team": "New York Jets",
    "college": "Florida",
    "jersey": 15,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_robert_griffin_iii",
    "name": "Robert Griffin III",
    "team": "Baltimore Ravens",
    "college": "Baylor",
    "jersey": 3,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_baker_mayfield",
    "name": "Baker Mayfield",
    "team": "Tampa Bay Buccaneers",
    "college": "Oklahoma",
    "jersey": 6,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_michael_vick",
    "name": "Michael Vick",
    "team": "Pittsburgh Steelers",
    "college": "Virginia Tech",
    "jersey": 7,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_kirk_cousins",
    "name": "Kirk Cousins",
    "team": "Minnesota Vikings",
    "college": "Michigan State",
    "jersey": 8,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_carson_wentz",
    "name": "Carson Wentz",
    "team": "Washington Commanders",
    "college": "North Dakota State",
    "jersey": 11,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_nick_foles",
    "name": "Nick Foles",
    "team": "Indianapolis Colts",
    "college": "Arizona",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jared_goff",
    "name": "Jared Goff",
    "team": "Detroit Lions",
    "college": "California",
    "jersey": 16,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_alex_smith",
    "name": "Alex Smith",
    "team": "Washington Commanders",
    "college": "Utah",
    "jersey": 11,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jimmy_garoppolo",
    "name": "Jimmy Garoppolo",
    "team": "Las Vegas Raiders",
    "college": "Eastern Illinois",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_derek_carr",
    "name": "Derek Carr",
    "team": "New Orleans Saints",
    "college": "Fresno State",
    "jersey": 4,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_ryan_fitzpatrick",
    "name": "Ryan Fitzpatrick",
    "team": "Washington Commanders",
    "college": "Harvard",
    "jersey": 14,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jameis_winston",
    "name": "Jameis Winston",
    "team": "New Orleans Saints",
    "college": "Florida State",
    "jersey": 3,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_kyler_murray",
    "name": "Kyler Murray",
    "team": "Arizona Cardinals",
    "college": "Oklahoma",
    "jersey": 1,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_mark_sanchez",
    "name": "Mark Sanchez",
    "team": "Washington Redskins",
    "college": "USC",
    "jersey": 6,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_joe_flacco",
    "name": "Joe Flacco",
    "team": "New York Jets",
    "college": "Delaware",
    "jersey": 5,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_marcus_mariota",
    "name": "Marcus Mariota",
    "team": "Philadelphia Eagles",
    "college": "Oregon",
    "jersey": 8,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jay_cutler",
    "name": "Jay Cutler",
    "team": "Miami Dolphins",
    "college": "Vanderbilt",
    "jersey": 6,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_sam_bradford",
    "name": "Sam Bradford",
    "team": "Arizona Cardinals",
    "college": "Oklahoma",
    "jersey": 8,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_tua_tagovailoa",
    "name": "Tua Tagovailoa",
    "team": "Miami Dolphins",
    "college": "Alabama",
    "jersey": 1,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_johnny_manziel",
    "name": "Johnny Manziel",
    "team": "Cleveland Browns",
    "college": "Texas A&M",
    "jersey": 2,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_andy_dalton",
    "name": "Andy Dalton",
    "team": "New Orleans Saints",
    "college": "TCU",
    "jersey": 14,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_carson_palmer",
    "name": "Carson Palmer",
    "team": "Arizona Cardinals",
    "college": "USC",
    "jersey": 3,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_ryan_tannehill",
    "name": "Ryan Tannehill",
    "team": "Tennessee Titans",
    "college": "Texas A&M",
    "jersey": 17,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_blake_bortles",
    "name": "Blake Bortles",
    "team": "Denver Broncos",
    "college": "UCF",
    "jersey": 5,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_gardner_minshew",
    "name": "Gardner Minshew",
    "team": "Indianapolis Colts",
    "college": "Washington State",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_teddy_bridgewater",
    "name": "Teddy Bridgewater",
    "team": "Detroit Lions",
    "college": "Louisville",
    "jersey": 5,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_mitchell_trubisky",
    "name": "Mitchell Trubisky",
    "team": "Pittsburgh Steelers",
    "college": "North Carolina",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_sam_darnold",
    "name": "Sam Darnold",
    "team": "San Francisco 49ers",
    "college": "USC",
    "jersey": 14,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_adrian_peterson",
    "name": "Adrian Peterson",
    "team": "Seattle Seahawks",
    "college": "Oklahoma",
    "jersey": 28,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_marshawn_lynch",
    "name": "Marshawn Lynch",
    "team": "Seattle Seahawks",
    "college": "California",
    "jersey": 24,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_frank_gore",
    "name": "Frank Gore",
    "team": "New York Jets",
    "college": "Miami (FL)",
    "jersey": 21,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_lesean_mccoy",
    "name": "LeSean McCoy",
    "team": "Tampa Bay Buccaneers",
    "college": "Pittsburgh",
    "jersey": 25,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_jamaal_charles",
    "name": "Jamaal Charles",
    "team": "Denver Broncos",
    "college": "Texas",
    "jersey": 25,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_arian_foster",
    "name": "Arian Foster",
    "team": "Miami Dolphins",
    "college": "Tennessee",
    "jersey": 23,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_le'veon_bell",
    "name": "Le'Veon Bell",
    "team": "Tampa Bay Buccaneers",
    "college": "Michigan State",
    "jersey": 26,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_todd_gurley",
    "name": "Todd Gurley",
    "team": "Atlanta Falcons",
    "college": "Georgia",
    "jersey": 30,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_ezekiel_elliott",
    "name": "Ezekiel Elliott",
    "team": "New England Patriots",
    "college": "Ohio State",
    "jersey": 15,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_derrick_henry",
    "name": "Derrick Henry",
    "team": "Tennessee Titans",
    "college": "Alabama",
    "jersey": 22,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_christian_mccaffrey",
    "name": "Christian McCaffrey",
    "team": "San Francisco 49ers",
    "college": "Stanford",
    "jersey": 23,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_saquon_barkley",
    "name": "Saquon Barkley",
    "team": "New York Giants",
    "college": "Penn State",
    "jersey": 26,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_alvin_kamara",
    "name": "Alvin Kamara",
    "team": "New Orleans Saints",
    "college": "Tennessee",
    "jersey": 41,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_reggie_bush",
    "name": "Reggie Bush",
    "team": "Buffalo Bills",
    "college": "USC",
    "jersey": 25,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_chris_johnson",
    "name": "Chris Johnson",
    "team": "Arizona Cardinals",
    "college": "East Carolina",
    "jersey": 28,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_mark_ingram_ii",
    "name": "Mark Ingram II",
    "team": "New Orleans Saints",
    "college": "Alabama",
    "jersey": 22,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_jonathan_taylor",
    "name": "Jonathan Taylor",
    "team": "Indianapolis Colts",
    "college": "Wisconsin",
    "jersey": 28,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_demarco_murray",
    "name": "DeMarco Murray",
    "team": "Tennessee Titans",
    "college": "Oklahoma",
    "jersey": 29,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_maurice_jones-drew",
    "name": "Maurice Jones-Drew",
    "team": "Oakland Raiders",
    "college": "UCLA",
    "jersey": 32,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_darren_sproles",
    "name": "Darren Sproles",
    "team": "Philadelphia Eagles",
    "college": "Kansas State",
    "jersey": 43,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_nick_chubb",
    "name": "Nick Chubb",
    "team": "Cleveland Browns",
    "college": "Georgia",
    "jersey": 24,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_dalvin_cook",
    "name": "Dalvin Cook",
    "team": "New York Jets",
    "college": "Florida State",
    "jersey": 33,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_james_conner",
    "name": "James Conner",
    "team": "Arizona Cardinals",
    "college": "Pittsburgh",
    "jersey": 6,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_devonta_freeman",
    "name": "Devonta Freeman",
    "team": "New York Giants",
    "college": "Florida State",
    "jersey": 31,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_doug_martin",
    "name": "Doug Martin",
    "team": "Oakland Raiders",
    "college": "Boise State",
    "jersey": 22,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_eddie_lacy",
    "name": "Eddie Lacy",
    "team": "Seattle Seahawks",
    "college": "Alabama",
    "jersey": 27,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_matt_forte",
    "name": "Matt Forte",
    "team": "New York Jets",
    "college": "Tulane",
    "jersey": 22,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_legarrette_blount",
    "name": "LeGarrette Blount",
    "team": "Detroit Lions",
    "college": "Oregon",
    "jersey": 29,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_peyton_hillis",
    "name": "Peyton Hillis",
    "team": "New York Giants",
    "college": "Arkansas",
    "jersey": 44,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_trent_richardson",
    "name": "Trent Richardson",
    "team": "Oakland Raiders",
    "college": "Alabama",
    "jersey": 34,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_larry_fitzgerald",
    "name": "Larry Fitzgerald",
    "team": "Arizona Cardinals",
    "college": "Pittsburgh",
    "jersey": 11,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_calvin_johnson",
    "name": "Calvin Johnson",
    "team": "Detroit Lions",
    "college": "Georgia Tech",
    "jersey": 81,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_julio_jones",
    "name": "Julio Jones",
    "team": "Tampa Bay Buccaneers",
    "college": "Alabama",
    "jersey": 11,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_antonio_brown",
    "name": "Antonio Brown",
    "team": "Tampa Bay Buccaneers",
    "college": "Central Michigan",
    "jersey": 84,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_odell_beckham_jr",
    "name": "Odell Beckham Jr.",
    "team": "Baltimore Ravens",
    "college": "LSU",
    "jersey": 13,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_deandre_hopkins",
    "name": "DeAndre Hopkins",
    "team": "Tennessee Titans",
    "college": "Clemson",
    "jersey": 10,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_aj_green",
    "name": "A.J. Green",
    "team": "Arizona Cardinals",
    "college": "Georgia",
    "jersey": 18,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_mike_evans",
    "name": "Mike Evans",
    "team": "Tampa Bay Buccaneers",
    "college": "Texas A&M",
    "jersey": 13,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_tyreek_hill",
    "name": "Tyreek Hill",
    "team": "Miami Dolphins",
    "college": "West Alabama",
    "jersey": 10,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_davante_adams",
    "name": "Davante Adams",
    "team": "Las Vegas Raiders",
    "college": "Fresno State",
    "jersey": 17,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_stefon_diggs",
    "name": "Stefon Diggs",
    "team": "Buffalo Bills",
    "college": "Maryland",
    "jersey": 14,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_michael_thomas",
    "name": "Michael Thomas",
    "team": "New Orleans Saints",
    "college": "Ohio State",
    "jersey": 13,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_cooper_kupp",
    "name": "Cooper Kupp",
    "team": "Los Angeles Rams",
    "college": "Eastern Washington",
    "jersey": 10,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_justin_jefferson",
    "name": "Justin Jefferson",
    "team": "Minnesota Vikings",
    "college": "LSU",
    "jersey": 18,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_ja'marr_chase",
    "name": "Ja'Marr Chase",
    "team": "Cincinnati Bengals",
    "college": "LSU",
    "jersey": 1,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_dez_bryant",
    "name": "Dez Bryant",
    "team": "Baltimore Ravens",
    "college": "Oklahoma State",
    "jersey": 88,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_wes_welker",
    "name": "Wes Welker",
    "team": "Denver Broncos",
    "college": "Texas Tech",
    "jersey": 83,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_julian_edelman",
    "name": "Julian Edelman",
    "team": "New England Patriots",
    "college": "Kent State",
    "jersey": 11,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_brandon_marshall",
    "name": "Brandon Marshall",
    "team": "New York Giants",
    "college": "UCF",
    "jersey": 15,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_victor_cruz",
    "name": "Victor Cruz",
    "team": "New York Giants",
    "college": "UMass",
    "jersey": 80,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_chad_johnson",
    "name": "Chad Johnson",
    "team": "New England Patriots",
    "college": "Oregon State",
    "jersey": 85,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_demaryius_thomas",
    "name": "Demaryius Thomas",
    "team": "New York Jets",
    "college": "Georgia Tech",
    "jersey": 88,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_aj_brown",
    "name": "A.J. Brown",
    "team": "Philadelphia Eagles",
    "college": "Ole Miss",
    "jersey": 11,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_deebo_samuel",
    "name": "Deebo Samuel",
    "team": "San Francisco 49ers",
    "college": "South Carolina",
    "jersey": 19,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_amari_cooper",
    "name": "Amari Cooper",
    "team": "Cleveland Browns",
    "college": "Alabama",
    "jersey": 2,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_dk_metcalf",
    "name": "DK Metcalf",
    "team": "Seattle Seahawks",
    "college": "Ole Miss",
    "jersey": 14,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_steve_smith_sr",
    "name": "Steve Smith Sr.",
    "team": "Baltimore Ravens",
    "college": "Utah",
    "jersey": 89,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_andre_johnson",
    "name": "Andre Johnson",
    "team": "Indianapolis Colts",
    "college": "Miami (FL)",
    "jersey": 80,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_anquan_boldin",
    "name": "Anquan Boldin",
    "team": "Detroit Lions",
    "college": "Florida State",
    "jersey": 81,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_jordy_nelson",
    "name": "Jordy Nelson",
    "team": "Oakland Raiders",
    "college": "Kansas State",
    "jersey": 87,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_desean_jackson",
    "name": "DeSean Jackson",
    "team": "Las Vegas Raiders",
    "college": "California",
    "jersey": 10,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_jarvis_landry",
    "name": "Jarvis Landry",
    "team": "New Orleans Saints",
    "college": "LSU",
    "jersey": 80,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_josh_gordon",
    "name": "Josh Gordon",
    "team": "Kansas City Chiefs",
    "college": "Baylor",
    "jersey": 19,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_juju_smith-schuster",
    "name": "JuJu Smith-Schuster",
    "team": "New England Patriots",
    "college": "USC",
    "jersey": 7,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_ceedee_lamb",
    "name": "CeeDee Lamb",
    "team": "Dallas Cowboys",
    "college": "Oklahoma",
    "jersey": 88,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_percy_harvin",
    "name": "Percy Harvin",
    "team": "Buffalo Bills",
    "college": "Florida",
    "jersey": 11,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_roddy_white",
    "name": "Roddy White",
    "team": "Atlanta Falcons",
    "college": "UAB",
    "jersey": 84,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_reggie_wayne",
    "name": "Reggie Wayne",
    "team": "Indianapolis Colts",
    "college": "Miami (FL)",
    "jersey": 87,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_hines_ward",
    "name": "Hines Ward",
    "team": "Pittsburgh Steelers",
    "college": "Georgia",
    "jersey": 86,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_emmanuel_sanders",
    "name": "Emmanuel Sanders",
    "team": "Buffalo Bills",
    "college": "SMU",
    "jersey": 1,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_michael_crabtree",
    "name": "Michael Crabtree",
    "team": "Arizona Cardinals",
    "college": "Texas Tech",
    "jersey": 15,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_golden_tate",
    "name": "Golden Tate",
    "team": "New York Giants",
    "college": "Notre Dame",
    "jersey": 15,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_donald_driver",
    "name": "Donald Driver",
    "team": "Green Bay Packers",
    "college": "Alcorn State",
    "jersey": 80,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_plaxico_burress",
    "name": "Plaxico Burress",
    "team": "Pittsburgh Steelers",
    "college": "Michigan State",
    "jersey": 17,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_vincent_jackson",
    "name": "Vincent Jackson",
    "team": "Tampa Bay Buccaneers",
    "college": "Northern Colorado",
    "jersey": 83,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_randall_cobb",
    "name": "Randall Cobb",
    "team": "New York Jets",
    "college": "Kentucky",
    "jersey": 18,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_eric_decker",
    "name": "Eric Decker",
    "team": "Tennessee Titans",
    "college": "Minnesota",
    "jersey": 87,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_rob_gronkowski",
    "name": "Rob Gronkowski",
    "team": "Tampa Bay Buccaneers",
    "college": "Arizona",
    "jersey": 87,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_travis_kelce",
    "name": "Travis Kelce",
    "team": "Kansas City Chiefs",
    "college": "Cincinnati",
    "jersey": 87,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_tony_gonzalez",
    "name": "Tony Gonzalez",
    "team": "Atlanta Falcons",
    "college": "California",
    "jersey": 88,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_antonio_gates",
    "name": "Antonio Gates",
    "team": "Los Angeles Chargers",
    "college": "Kent State",
    "jersey": 85,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_jason_witten",
    "name": "Jason Witten",
    "team": "Las Vegas Raiders",
    "college": "Tennessee",
    "jersey": 82,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_george_kittle",
    "name": "George Kittle",
    "team": "San Francisco 49ers",
    "college": "Iowa",
    "jersey": 85,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_jimmy_graham",
    "name": "Jimmy Graham",
    "team": "Chicago Bears",
    "college": "Miami (FL)",
    "jersey": 80,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_greg_olsen",
    "name": "Greg Olsen",
    "team": "Seattle Seahawks",
    "college": "Miami (FL)",
    "jersey": 88,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_zach_ertz",
    "name": "Zach Ertz",
    "team": "Arizona Cardinals",
    "college": "Stanford",
    "jersey": 86,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_vernon_davis",
    "name": "Vernon Davis",
    "team": "Washington Redskins",
    "college": "Maryland",
    "jersey": 85,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_darren_waller",
    "name": "Darren Waller",
    "team": "New York Giants",
    "college": "Georgia Tech",
    "jersey": 12,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_martellus_bennett",
    "name": "Martellus Bennett",
    "team": "New England Patriots",
    "college": "Texas A&M",
    "jersey": 88,
    "position": "TE",
    "league": "NFL"
  },
  {
    "id": "nfl_ray_lewis",
    "name": "Ray Lewis",
    "team": "Baltimore Ravens",
    "college": "Miami (FL)",
    "jersey": 52,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_troy_polamalu",
    "name": "Troy Polamalu",
    "team": "Pittsburgh Steelers",
    "college": "USC",
    "jersey": 43,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_ed_reed",
    "name": "Ed Reed",
    "team": "New York Jets",
    "college": "Miami (FL)",
    "jersey": 20,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_charles_woodson",
    "name": "Charles Woodson",
    "team": "Oakland Raiders",
    "college": "Michigan",
    "jersey": 24,
    "position": "CB/S",
    "league": "NFL"
  },
  {
    "id": "nfl_darrelle_revis",
    "name": "Darrelle Revis",
    "team": "Kansas City Chiefs",
    "college": "Pittsburgh",
    "jersey": 24,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_richard_sherman",
    "name": "Richard Sherman",
    "team": "San Francisco 49ers",
    "college": "Stanford",
    "jersey": 25,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_jj_watt",
    "name": "J.J. Watt",
    "team": "Arizona Cardinals",
    "college": "Wisconsin",
    "jersey": 99,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_aaron_donald",
    "name": "Aaron Donald",
    "team": "Los Angeles Rams",
    "college": "Pittsburgh",
    "jersey": 99,
    "position": "DT",
    "league": "NFL"
  },
  {
    "id": "nfl_von_miller",
    "name": "Von Miller",
    "team": "Buffalo Bills",
    "college": "Texas A&M",
    "jersey": 40,
    "position": "OLB",
    "league": "NFL"
  },
  {
    "id": "nfl_khalil_mack",
    "name": "Khalil Mack",
    "team": "Los Angeles Chargers",
    "college": "Buffalo",
    "jersey": 52,
    "position": "OLB",
    "league": "NFL"
  },
  {
    "id": "nfl_luke_kuechly",
    "name": "Luke Kuechly",
    "team": "Carolina Panthers",
    "college": "Boston College",
    "jersey": 59,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_ndamukong_suh",
    "name": "Ndamukong Suh",
    "team": "Philadelphia Eagles",
    "college": "Nebraska",
    "jersey": 93,
    "position": "DT",
    "league": "NFL"
  },
  {
    "id": "nfl_jalen_ramsey",
    "name": "Jalen Ramsey",
    "team": "Miami Dolphins",
    "college": "Florida State",
    "jersey": 20,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_clay_matthews_iii",
    "name": "Clay Matthews III",
    "team": "Los Angeles Rams",
    "college": "USC",
    "jersey": 52,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_julius_peppers",
    "name": "Julius Peppers",
    "team": "Carolina Panthers",
    "college": "North Carolina",
    "jersey": 90,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_demarcus_ware",
    "name": "DeMarcus Ware",
    "team": "Denver Broncos",
    "college": "Troy",
    "jersey": 94,
    "position": "OLB",
    "league": "NFL"
  },
  {
    "id": "nfl_patrick_peterson",
    "name": "Patrick Peterson",
    "team": "Minnesota Vikings",
    "college": "LSU",
    "jersey": 7,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_james_harrison",
    "name": "James Harrison",
    "team": "New England Patriots",
    "college": "Kent State",
    "jersey": 92,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_brian_urlacher",
    "name": "Brian Urlacher",
    "team": "Chicago Bears",
    "college": "New Mexico",
    "jersey": 54,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_jason_pierre-paul",
    "name": "Jason Pierre-Paul",
    "team": "Tampa Bay Buccaneers",
    "college": "South Florida",
    "jersey": 90,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_jared_allen",
    "name": "Jared Allen",
    "team": "Carolina Panthers",
    "college": "Idaho State",
    "jersey": 69,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_tj_watt",
    "name": "T.J. Watt",
    "team": "Pittsburgh Steelers",
    "college": "Wisconsin",
    "jersey": 90,
    "position": "OLB",
    "league": "NFL"
  },
  {
    "id": "nfl_myles_garrett",
    "name": "Myles Garrett",
    "team": "Cleveland Browns",
    "college": "Texas A&M",
    "jersey": 95,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_nick_bosa",
    "name": "Nick Bosa",
    "team": "San Francisco 49ers",
    "college": "Ohio State",
    "jersey": 97,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_micah_parsons",
    "name": "Micah Parsons",
    "team": "Dallas Cowboys",
    "college": "Penn State",
    "jersey": 11,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_terrell_suggs",
    "name": "Terrell Suggs",
    "team": "Kansas City Chiefs",
    "college": "Arizona State",
    "jersey": 55,
    "position": "OLB",
    "league": "NFL"
  },
  {
    "id": "nfl_manti_te'o",
    "name": "Manti Te'o",
    "team": "New Orleans Saints",
    "college": "Notre Dame",
    "jersey": 51,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_eric_berry",
    "name": "Eric Berry",
    "team": "Kansas City Chiefs",
    "college": "Tennessee",
    "jersey": 29,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_joey_bosa",
    "name": "Joey Bosa",
    "team": "Los Angeles Chargers",
    "college": "Ohio State",
    "jersey": 97,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_patrick_willis",
    "name": "Patrick Willis",
    "team": "San Francisco 49ers",
    "college": "Ole Miss",
    "jersey": 52,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_tyrann_mathieu",
    "name": "Tyrann Mathieu",
    "team": "New Orleans Saints",
    "college": "LSU",
    "jersey": 32,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_bobby_wagner",
    "name": "Bobby Wagner",
    "team": "Seattle Seahawks",
    "college": "Utah State",
    "jersey": 54,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_earl_thomas",
    "name": "Earl Thomas",
    "team": "Baltimore Ravens",
    "college": "Texas",
    "jersey": 29,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_aqib_talib",
    "name": "Aqib Talib",
    "team": "Los Angeles Rams",
    "college": "Kansas",
    "jersey": 21,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_jadeveon_clowney",
    "name": "Jadeveon Clowney",
    "team": "Baltimore Ravens",
    "college": "South Carolina",
    "jersey": 24,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_stephon_gilmore",
    "name": "Stephon Gilmore",
    "team": "Dallas Cowboys",
    "college": "South Carolina",
    "jersey": 21,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_josh_norman",
    "name": "Josh Norman",
    "team": "Washington Redskins",
    "college": "Coastal Carolina",
    "jersey": 24,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_cameron_chancellor",
    "name": "Cameron Chancellor",
    "team": "Seattle Seahawks",
    "college": "Virginia Tech",
    "jersey": 31,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_ryan_shazier",
    "name": "Ryan Shazier",
    "team": "Pittsburgh Steelers",
    "college": "Ohio State",
    "jersey": 50,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_sauce_gardner",
    "name": "Sauce Gardner",
    "team": "New York Jets",
    "college": "Cincinnati",
    "jersey": 1,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_malcolm_jenkins",
    "name": "Malcolm Jenkins",
    "team": "New Orleans Saints",
    "college": "Ohio State",
    "jersey": 27,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_haloti_ngata",
    "name": "Haloti Ngata",
    "team": "Philadelphia Eagles",
    "college": "Oregon",
    "jersey": 92,
    "position": "DT",
    "league": "NFL"
  },
  {
    "id": "nfl_mario_williams",
    "name": "Mario Williams",
    "team": "Miami Dolphins",
    "college": "NC State",
    "jersey": 94,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_charles_tillman",
    "name": "Charles Tillman",
    "team": "Carolina Panthers",
    "college": "Louisiana-Lafayette",
    "jersey": 33,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_dwight_freeney",
    "name": "Dwight Freeney",
    "team": "Seattle Seahawks",
    "college": "Syracuse",
    "jersey": 93,
    "position": "DE",
    "league": "NFL"
  },
  {
    "id": "nfl_champ_bailey",
    "name": "Champ Bailey",
    "team": "New Orleans Saints",
    "college": "Georgia",
    "jersey": 27,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_eric_weddle",
    "name": "Eric Weddle",
    "team": "Los Angeles Rams",
    "college": "Utah",
    "jersey": 20,
    "position": "S",
    "league": "NFL"
  },
  {
    "id": "nfl_antonio_cromartie",
    "name": "Antonio Cromartie",
    "team": "Indianapolis Colts",
    "college": "Florida State",
    "jersey": 31,
    "position": "CB",
    "league": "NFL"
  },
  {
    "id": "nfl_london_fletcher",
    "name": "London Fletcher",
    "team": "Washington Redskins",
    "college": "John Carroll",
    "jersey": 59,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_cam_ward",
    "name": "Cam Ward",
    "team": "Tennessee Titans",
    "college": "Miami (FL)",
    "jersey": 1,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_travis_hunter",
    "name": "Travis Hunter",
    "team": "Jacksonville Jaguars",
    "college": "Colorado",
    "jersey": 12,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_abdul_carter",
    "name": "Abdul Carter",
    "team": "New York Giants",
    "college": "Penn State",
    "jersey": 51,
    "position": "LB",
    "league": "NFL"
  },
  {
    "id": "nfl_ashton_jeanty",
    "name": "Ashton Jeanty",
    "team": "Las Vegas Raiders",
    "college": "Boise State",
    "jersey": 2,
    "position": "RB",
    "league": "NFL"
  },
  {
    "id": "nfl_caleb_williams",
    "name": "Caleb Williams",
    "team": "Chicago Bears",
    "college": "USC",
    "jersey": 18,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_jayden_daniels",
    "name": "Jayden Daniels",
    "team": "Washington Commanders",
    "college": "LSU",
    "jersey": 5,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_drake_maye",
    "name": "Drake Maye",
    "team": "New England Patriots",
    "college": "North Carolina",
    "jersey": 10,
    "position": "QB",
    "league": "NFL"
  },
  {
    "id": "nfl_marvin_harrison_jr",
    "name": "Marvin Harrison Jr.",
    "team": "Arizona Cardinals",
    "college": "Ohio State",
    "jersey": 18,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_malik_nabers",
    "name": "Malik Nabers",
    "team": "New York Giants",
    "college": "LSU",
    "jersey": 1,
    "position": "WR",
    "league": "NFL"
  },
  {
    "id": "nfl_michael_penix_jr",
    "name": "Michael Penix Jr.",
    "team": "Atlanta Falcons",
    "college": "Washington",
    "jersey": 9,
    "position": "QB",
    "league": "NFL"
  }
];

// Make it available globally
window.WELL_KNOWN_PLAYERS = WELL_KNOWN_PLAYERS;
