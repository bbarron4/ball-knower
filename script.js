// Ball Knower - Clean Script
// Global Variables
let currentScreen = 'home-screen';
let currentGame = {
    mode: '',
    sport: 'nfl',
    inputMode: 'multiple-choice',
    playerCount: 1,
    questionCount: 10,
    currentQuestion: 0,
    score: 0,
    questions: [],
    timer: null,
    timeLeft: 0,
    correctAnswers: 0,
    streak: 0,
    maxStreak: 0,
    gameStartTime: 0
};

// SportsDataIO API Configuration
const SPORTSDATA_CONFIG = {
    apiKey: 'f84fc39ff90f4fa590171755175e5b66', // Your actual API key
    baseUrl: 'https://api.sportsdata.io/v3/nfl',
    endpoints: {
        players: '/scores/json/Players',
        teams: '/scores/json/Teams',
        playerProfiles: '/scores/json/PlayerGameStats'
    },
    enabled: false // Set to false to disable API loading completely for maximum speed
};

// API Data Cache
let apiPlayerData = new Map();
let apiLastUpdated = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Essential Players List - Only load these specific players from API
const ESSENTIAL_PLAYERS = [
    // Current Superstars
    'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Dak Prescott',
    'Justin Herbert', 'Jalen Hurts', 'Tua Tagovailoa', 'Trevor Lawrence', 'C.J. Stroud',
    
    // Recent Retired Legends
    'Tom Brady', 'Peyton Manning', 'Drew Brees', 'Ben Roethlisberger', 'Matt Ryan',
    'Philip Rivers', 'Cam Newton', 'Andrew Luck', 'Eli Manning',
    
    // Current Star RBs
    'Derrick Henry', 'Christian McCaffrey', 'Saquon Barkley', 'Alvin Kamara', 'Nick Chubb',
    'Josh Jacobs', 'Jonathan Taylor', 'Austin Ekeler', 'Joe Mixon',
    
    // Recent Retired RBs
    'Adrian Peterson', 'LeSean McCoy', 'Marshawn Lynch', 'Frank Gore', 'Arian Foster',
    
    // Current Star WRs/TEs
    'Travis Kelce', 'Davante Adams', 'Tyreek Hill', 'Stefon Diggs', 'Cooper Kupp',
    'Justin Jefferson', 'Ja\'Marr Chase', 'CeeDee Lamb', 'George Kittle', 'Mark Andrews',
    
    // Recent Retired WRs/TEs
    'Rob Gronkowski', 'Calvin Johnson', 'Larry Fitzgerald', 'Antonio Brown', 'Odell Beckham Jr.',
    
    // Current Star Defense
    'Aaron Donald', 'T.J. Watt', 'Myles Garrett', 'Nick Bosa', 'Micah Parsons',
    'Jalen Ramsey', 'Stefon Gilmore', 'Derwin James', 'Fred Warner',
    
    // Recent Retired Defense
    'J.J. Watt', 'Luke Kuechly', 'Von Miller', 'Khalil Mack'
];

// SportsDataIO API Functions
async function fetchFromSportsDataIO(endpoint, params = '') {
    const url = `${SPORTSDATA_CONFIG.baseUrl}${endpoint}${params}?key=${SPORTSDATA_CONFIG.apiKey}`;
    
    try {
        console.log(`Fetching from SportsDataIO: ${endpoint}${params}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('SportsDataIO API Error:', error);
        return null;
    }
}

async function loadPlayerDataFromAPI() {
    // Check if cache is still valid
    if (apiLastUpdated && (Date.now() - apiLastUpdated) < CACHE_DURATION) {
        console.log('Using cached API data');
        return true;
    }
    
    try {
        console.log('Loading essential player data from SportsDataIO API...');
        
        // Fetch current season players
        const currentPlayers = await fetchFromSportsDataIO(SPORTSDATA_CONFIG.endpoints.players);
        
        // Clear existing cache
        apiPlayerData.clear();
        
        // Only process essential players for maximum performance
        const essentialPlayersSet = new Set(ESSENTIAL_PLAYERS);
        
        // Process current players - only store the essential ones we need
        if (currentPlayers && Array.isArray(currentPlayers)) {
            let foundCount = 0;
            currentPlayers.forEach(player => {
                if (player.Name || player.CommonName) {
                    const playerName = player.Name || player.CommonName;
                    
                    // Only store essential players
                    if (essentialPlayersSet.has(playerName)) {
                        apiPlayerData.set(playerName, {
                            team: player.Team || player.CurrentTeam || 'Free Agent',
                            college: player.College || 'Unknown College',
                            jersey: player.Jersey || player.Number || player.JerseyNumber,
                            position: player.Position,
                            era: 'modern',
                            active: player.Active !== false,
                            playerGRid: player.PlayerGRid,
                            currentTeamGRid: player.CurrentTeamGRid
                        });
                        foundCount++;
                    }
                }
            });
            console.log(`Found ${foundCount} essential players in API`);
        }
        
        apiLastUpdated = Date.now();
        console.log(`Successfully loaded ${apiPlayerData.size} players from SportsDataIO API`);
        return true;
        
    } catch (error) {
        console.error('Failed to load API data:', error);
        return false;
    }
}

// Initialize API data on page load
async function initializeAPIData() {
    if (!SPORTSDATA_CONFIG.enabled) {
        console.log('🚀 API loading disabled for maximum speed - using hardcoded data only');
        return false;
    }
    
    console.log('Initializing SportsDataIO API integration...');
    
    const success = await loadPlayerDataFromAPI();
    if (success) {
        console.log('✅ SportsDataIO API integration active!');
        console.log(`📊 Loaded ${apiPlayerData.size} essential players with real-time data`);
    } else {
        console.log('❌ API integration failed, using fallback data');
    }
    
    return success;
}

// Household Names for Easy Mode
const householdNames = [
    // QBs - Current Stars (2010+)
    'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Dak Prescott', 'Justin Herbert',
    'Jalen Hurts', 'Tua Tagovailoa', 'Trevor Lawrence', 'C.J. Stroud', 'Anthony Richardson', 'Bryce Young',
    'Brock Purdy', 'Geno Smith', 'Derek Carr', 'Daniel Jones', 'Jared Goff', 'Baker Mayfield',
    'Russell Wilson', 'Kirk Cousins', 'Matthew Stafford', 'Deshaun Watson', 'Ryan Tannehill',
    'Jimmy Garoppolo', 'Mac Jones', 'Zach Wilson', 'Kenny Pickett', 'Sam Darnold', 'Justin Fields',
    'Will Levis', 'Aidan O\'Connell', 'Jake Browning', 'Gardner Minshew', 'Tyler Huntley',
    'Jordan Love', 'Caleb Williams', 'Jayden Daniels', 'Drake Maye', 'Bo Nix', 'Michael Penix Jr.',
    'J.J. McCarthy', 'Spencer Rattler', 'Malik Willis', 'Desmond Ridder', 'Hendon Hooker',
    'Carson Strong', 'Bailey Zappe', 'Skylar Thompson', 'Sam Howell', 'Tanner McKee',
    'Clayton Tune', 'Dorian Thompson-Robinson', 'Jaren Hall', 'Stetson Bennett', 'Jake Haener',
    
    // QBs - Recent Retired (2010+)
    'Tom Brady', 'Peyton Manning', 'Drew Brees', 'Ben Roethlisberger', 'Matt Ryan', 'Philip Rivers',
    'Cam Newton', 'Andrew Luck', 'Eli Manning', 'Tony Romo', 'Carson Palmer',
    'Alex Smith', 'Joe Flacco', 'Jay Cutler', 'Matt Schaub', 'Chad Pennington', 'Donovan McNabb',
    'Michael Vick', 'Matt Hasselbeck', 'David Garrard', 'Brady Quinn', 'JaMarcus Russell', 'Matt Leinart', 'Vince Young', 'Matt Cassel',
    
    // QBs - Historical (Pre-2010)
    'Brett Favre', 'Kurt Warner',
    
    // RBs - Current Stars (2010+)
    'Derrick Henry', 'Saquon Barkley', 'Christian McCaffrey', 'Alvin Kamara', 'Nick Chubb',
    'Josh Jacobs', 'Jonathan Taylor', 'Austin Ekeler', 'Joe Mixon', 'Miles Sanders', 'Tony Pollard',
    'Breece Hall', 'Bijan Robinson', 'Jahmyr Gibbs', 'Kenneth Walker III', 'Rachaad White',
    'Isiah Pacheco', 'Rhamondre Stevenson', 'Travis Etienne', 'Dameon Pierce', 'J.K. Dobbins',
    'Cam Akers', 'D\'Andre Swift', 'Javonte Williams', 'Najee Harris', 'Antonio Gibson',
    'Clyde Edwards-Helaire', 'D\'Onta Foreman', 'Gus Edwards', 'Zack Moss', 'Tyler Allgeier',
    'Tank Bigsby', 'Zach Charbonnet', 'Roschon Johnson', 'Tyjae Spears', 'De\'Von Achane',
    'Jaylen Warren', 'Jerome Ford', 'Chuba Hubbard',
    
    // RBs - Recent Retired (2010+)
    'Ezekiel Elliott', 'Dalvin Cook', 'Aaron Jones', 'Leonard Fournette', 'Todd Gurley',
    'Le\'Veon Bell', 'David Johnson', 'Kareem Hunt', 'James Conner', 'Melvin Gordon',
    'Mark Ingram', 'LeSean McCoy', 'Marshaun Lynch', 'Adrian Peterson', 'Frank Gore',
    'Arian Foster', 'Jamaal Charles',
    
    // RBs - Historical (Pre-2010)
    'LaDainian Tomlinson', 'Shaun Alexander', 'Clinton Portis', 'Edgerrin James', 'Marshall Faulk',
    'Ricky Williams', 'Jamal Lewis', 'Corey Dillon', 'Warrick Dunn', 'Tony Dorsett',
    'Marcus Allen', 'Thurman Thomas', 'Jerome Bettis', 'Curtis Martin', 'Barry Sanders',
    'Emmitt Smith', 'Walter Payton', 'Jim Brown', 'Eric Dickerson',
    
    // WRs - Current Stars (2010+)
    'Davante Adams', 'Tyreek Hill', 'Stefon Diggs', 'Cooper Kupp', 'Justin Jefferson',
    'Ja\'Marr Chase', 'CeeDee Lamb', 'DK Metcalf', 'A.J. Brown', 'Terry McLaurin', 'D.J. Moore',
    'Chris Godwin', 'Mike Williams', 'Brandin Cooks', 'Tyler Lockett', 'Robert Woods',
    'Deebo Samuel', 'Amon-Ra St. Brown', 'Jaylen Waddle', 'Garrett Wilson', 'Drake London',
    'Chris Olave', 'Tee Higgins', 'Marquise Brown', 'Courtland Sutton', 'Dionte Johnson',
    'Tyler Boyd', 'Marvin Jones', 'Kenny Golladay', 'Allen Lazard', 'Russell Gage',
    'Kendrick Bourne', 'Jakobi Meyers', 'Hunter Renfrow', 'Cole Beasley', 'Golden Tate',
    'Amari Cooper', 'Michael Thomas', 'Keenan Allen', 'DeAndre Hopkins', 'Antonio Brown',
    'Odell Beckham Jr.', 'Mike Evans', 'Puka Nacua', 'Tank Dell', 'Zay Flowers', 'Jordan Addison',
    'Jaxon Smith-Njigba', 'Quentin Johnston', 'Marvin Mims', 'Josh Downs', 'Jayden Reed',
    'Rashee Rice', 'Dontayvion Wicks', 'Rome Odunze', 'Malik Nabers', 'Brian Thomas Jr.',
    'Keon Coleman', 'Ladd McConkey', 'Adonai Mitchell', 'Xavier Worthy', 'Troy Franklin',
    'Ricky Pearsall', 'Xavier Legette', 'Ja\'Lynn Polk', 'Jalen McMillan', 'Marvin Harrison Jr.',
    
    // WRs - Recent Retired (2010+)
    'Larry Fitzgerald', 'Anquan Boldin', 'Reggie Wayne', 'Chad Johnson', 'Santana Moss',
    'Plaxico Burress', 'Wes Welker', 'Victor Cruz', 'Hakeem Nicks', 'DeSean Jackson',
    'Jeremy Maclin', 'Torrey Smith', 'Allen Robinson', 'Adam Thielen', 'Jarvis Landry',
    'Julian Edelman', 'Emmanuel Sanders',
    
    // WRs - Historical (Pre-2010)
    'Cris Carter', 'Marvin Harrison', 'Tim Brown', 'Isaac Bruce', 'Torry Holt',
    'Hines Ward', 'Roddy White', 'Steve Smith Sr.', 'Mario Manningham', 'David Tyree',
    
    // TEs - Current Stars (2010+) - Trimmed to most popular
    'Travis Kelce', 'George Kittle', 'Mark Andrews', 'Darren Waller', 'Kyle Pitts',
    'T.J. Hockenson', 'Dalton Kincaid', 'Pat Freiermuth', 'Evan Engram', 'Zach Ertz',
    'Tyler Higbee', 'Hunter Henry', 'Dallas Goedert', 'Noah Fant', 'Sam LaPorta',
    'Jake Ferguson', 'Tucker Kraft', 'Luke Musgrave', 'Michael Mayer', 'Trey McBride',
    'Cole Kmet', 'David Njoku', 'Gerald Everett', 'Tyler Conklin', 'Hayden Hurst',
    'Mike Gesicki', 'Austin Hooper', 'Jonnu Smith', 'Logan Thomas',
    
    // TEs - Historical (Pre-2010) - Trimmed to most popular
    'Rob Gronkowski', 'Jimmy Graham', 'Antonio Gates', 'Jason Witten', 'Greg Olsen',
    'Jared Cook', 'Tony Gonzalez', 'Shannon Sharpe', 'Vernon Davis', 'Dallas Clark',
    'Jeremy Shockey',
    
    // Defense - Current Stars (2010+) - Trimmed to most popular
    'Aaron Donald', 'T.J. Watt', 'Myles Garrett', 'Nick Bosa', 'Joey Bosa', 'Micah Parsons',
    'Darius Leonard', 'Fred Warner', 'Roquan Smith', 'Devin White', 'Trevon Diggs',
    'Jalen Ramsey', 'Stefon Gilmore', 'Xavien Howard', 'Jaire Alexander', 'Derwin James',
    'Minkah Fitzpatrick', 'Tyrann Mathieu', 'Harrison Smith', 'Jamal Adams', 'Sauce Gardner',
    'Pat Surtain II', 'Denzel Ward', 'Marshon Lattimore', 'Darius Slay', 'Marlon Humphrey',
    'Marcus Peters', 'A.J. Terrell', 'Tariq Woolen', 'Trent McDuffie', 'DeMarcus Lawrence',
    'Khalil Mack', 'Von Miller', 'Chandler Jones', 'Luke Kuechly', 'Bobby Wagner',
    'Chris Jones', 'Quinnen Williams', 'Jeffery Simmons', 'Dexter Lawrence', 'Vita Vea',
    'Derrick Brown', 'Rashan Gary', 'Montez Sweat', 'Josh Allen', 'Brian Burns', 'Maxx Crosby',
    'Trey Hendrickson', 'Danielle Hunter', 'Cameron Jordan', 'Calais Campbell',
    'Fletcher Cox', 'Grady Jarrett', 'Kenny Clark', 'Arik Armstead', 'DeForest Buckner',
    'Jalen Carter', 'Will Anderson Jr.', 'Devon Witherspoon', 'Christian Gonzalez',
    'Joey Porter Jr.', 'Deonte Banks', 'Kelee Ringo', 'Tyrique Stevenson',
    
    // Defense - Recent Retired (2010+)
    'J.J. Watt', 'Ed Reed', 'Troy Polamalu', 'Richard Sherman',
    
    // Defense - Historical (Pre-2010)
    'Lawrence Taylor', 'Reggie White', 'Bruce Smith', 'Deion Sanders', 'Ronnie Lott',
    'Dick Butkus', 'Ray Lewis', 'Brian Urlacher', 'Junior Seau', 'Derrick Thomas',
    'Michael Strahan', 'Warren Sapp', 'John Randle', 'Cortez Kennedy', 'Simeon Rice',
    'Champ Bailey', 'Charles Woodson', 'Darren Woodson', 'Rod Woodson',
    
    // Special Teams
    'Devin Hester', 'Darren Sproles', 'Cordarrelle Patterson', 'Tyreek Hill', 'Jakeem Grant',
    'Dante Hall', 'Josh Cribbs', 'Andre Roberts', 'Tarik Cohen', 'Nyheim Hines'
];

// Hero Banner Management
function setHeroBanner() {
    const heroBanner = document.getElementById('hero-banner');
    if (!heroBanner) return;

    const sources = [
            'images/football1.jpg',
            'images/football2.jpg', 
            'images/football3.jpg',
            'images/basketball1.jpg'
        ];
        
    // Preload images to avoid decode jank on swap
    const preloaded = sources.map(src => { const img = new Image(); img.src = src; return img; });
        let currentImageIndex = 0;
        
        function changeBackground() {
        const next = preloaded[currentImageIndex];
        if (next && next.complete) {
            heroBanner.style.backgroundImage = `url('${next.src}')`;
            currentImageIndex = (currentImageIndex + 1) % preloaded.length;
        }
    }

    // Set initial background after first image has data
    if (preloaded[0].complete) {
        heroBanner.style.backgroundImage = `url('${preloaded[0].src}')`;
    } else {
        preloaded[0].addEventListener('load', () => {
            heroBanner.style.backgroundImage = `url('${preloaded[0].src}')`;
        });
    }
        
        // Change background every 5 seconds
        setInterval(changeBackground, 5000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showScreen('home-screen');
    console.log('Ball Knower app initialized');
    
    // Set hero banner background
    setHeroBanner();
    
    // Initialize SportsDataIO API data asynchronously (don't block page load)
    // Only load if user wants API data (can be disabled for even faster loading)
    setTimeout(() => {
        initializeAPIData();
    }, 500);
});

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Scroll to top of page
    window.scrollTo(0, 0);
}

// Navigation Functions
function showHome() {
    showScreen('home-screen');
}

function showLeaderboard() {
    showScreen('leaderboard-screen');
}

function showProfile() {
    showScreen('profile-screen');
}

// Game Functions
function startGame(mode) {
    console.log(`🎮 startGame called with mode: ${mode}`);
    console.log(`🎮 Current sport BEFORE any changes: ${currentGame.sport}`);
    
    currentGame.mode = mode;
    
    // Keep previous settings if they exist, otherwise use defaults
    if (!currentGame.sport) {
        console.log(`⚠️ No sport set, defaulting to NFL`);
        currentGame.sport = 'nfl';
    } else {
        console.log(`✅ Sport already set to: ${currentGame.sport}`);
    }
    if (!currentGame.inputMode) currentGame.inputMode = 'multiple-choice';
    if (!currentGame.playerCount) currentGame.playerCount = 1;
    if (!currentGame.questionCount) currentGame.questionCount = 10;
    
    console.log(`🎮 Sport BEFORE restoreSetupUI: ${currentGame.sport}`);
    // Restore UI to match current settings
    restoreSetupUI();
    console.log(`🎮 Sport AFTER restoreSetupUI: ${currentGame.sport}`);
    
    // Show setup screen
    showScreen('setup-screen');
    
    // Update setup title based on mode
    const titles = {
        'college-guesser': 'College Guesser - Setup',
        'jersey-guesser': 'Jersey Number Guesser - Setup',
        'achievement-guesser': 'General Trivia - Setup',
        'survival': 'Survival Mode - Setup',
        'multiplayer': 'Multiplayer - Setup'
    };
    
    document.getElementById('setup-title').textContent = titles[mode] || 'Game Setup';
    
    // Show/hide sections based on game mode
    const gameModeSelection = document.getElementById('game-mode-selection');
    const questionCountSection = document.getElementById('question-count-section');
    const highScoreDisplay = document.getElementById('high-score-display');
    
    if (mode === 'survival') {
        // Show game mode selection and high score, hide question count
        gameModeSelection.style.display = 'block';
        questionCountSection.style.display = 'none';
        highScoreDisplay.style.display = 'block';
        
        // Load and display high score
        loadHighScore();
    } else {
        // Show question count, hide game mode selection and high score
        gameModeSelection.style.display = 'none';
        questionCountSection.style.display = 'block';
        highScoreDisplay.style.display = 'none';
    }
}

// Setup Functions
function restoreSetupUI() {
    console.log(`🔄 restoreSetupUI called - currentGame.sport = ${currentGame.sport}`);
    
    // Restore sport selection
    document.querySelectorAll('.sport-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnSport = btn.getAttribute('onclick')?.match(/selectSport\('(.+?)'\)/);
        if (btnSport && btnSport[1] === currentGame.sport) {
            btn.classList.add('active');
            console.log(`✅ restoreSetupUI: Activated ${btnSport[1]} button`);
        }
    });
    
    // Restore input type selection
    document.querySelectorAll('.input-type-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnInputType = btn.getAttribute('onclick')?.match(/selectInputType\('(.+?)'\)/);
        if (btnInputType && btnInputType[1] === currentGame.inputMode) {
            btn.classList.add('active');
        }
    });
    
    // Restore question count
    const questionCountEl = document.getElementById('question-count');
    if (questionCountEl) {
        questionCountEl.textContent = currentGame.questionCount;
    }
}

function selectSport(sport) {
    console.log(`🔵 selectSport called with: ${sport}`);
    
    // Update both currentGame and multiplayerGame
    console.log(`🔵 Previous sport: ${currentGame.sport}`);
    currentGame.sport = sport;
    multiplayerGame.gameSettings.sport = sport;
    console.log(`🟢 New sport set to: ${currentGame.sport}`);
    
    // Update UI
    const allButtons = document.querySelectorAll('.sport-btn');
    console.log(`🔍 Found ${allButtons.length} sport buttons`);
    
    allButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        
        // Check onclick attribute
        const onclickAttr = btn.getAttribute('onclick');
        const onclickSport = onclickAttr?.match(/selectSport\('(.+?)'\)/);
        
        if (onclickSport && onclickSport[1] === sport) {
            btn.classList.add('active');
            console.log(`✅ Button ${index}: Activated ${sport} button (onclick)`);
        }
        
        // Check data-sport attribute
        const dataSport = btn.getAttribute('data-sport');
        if (dataSport === sport) {
            btn.classList.add('active');
            console.log(`✅ Button ${index}: Activated ${sport} button (data-sport)`);
        }
    });
    
    console.log(`🎯 Final values - currentGame.sport: ${currentGame.sport}, multiplayerGame: ${multiplayerGame.gameSettings.sport}`);
}

// Difficulty selection removed - using single well-known players dataset

function selectInputType(inputType) {
    currentGame.inputMode = inputType;
    
    // Update UI
    document.querySelectorAll('.input-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function submitTextAnswer() {
    const textInput = document.getElementById('text-answer-input');
    const userAnswer = textInput.value.trim();
    
    if (!userAnswer) {
        showMessage('Please enter an answer!', 'error');
        return;
    }
    
    const question = currentGame.questions[currentGame.currentQuestion];
    const isCorrect = checkTextAnswer(userAnswer, question.correctAnswer, question.type);
    
    // Clear the input
    textInput.value = '';
    
    if (currentGame.timer) {
        clearInterval(currentGame.timer);
        currentGame.timer = null;
    }
    
    if (isCorrect) {
        currentGame.score += 10;
        currentGame.correctAnswers++;
        currentGame.streak++;
        currentGame.maxStreak = Math.max(currentGame.maxStreak, currentGame.streak);
        showMessage('Correct!', 'success');
        
        // Update UI immediately for survival mode
        if (currentGame.mode === 'survival') {
            document.querySelector('.question-number').textContent = `Survival Streak: ${currentGame.streak}`;
        }
    } else {
        currentGame.streak = 0;
        showMessage(`Incorrect! The answer was: ${question.correctAnswer}`, 'error');
        
        // In survival mode, end game immediately on wrong answer
        if (currentGame.mode === 'survival') {
            setTimeout(() => {
                endGame();
            }, 1000);
            return;
        }
    }
    
    setTimeout(() => {
        nextQuestion();
    }, 1000);
}

function checkTextAnswer(userAnswer, correctAnswer, questionType) {
    const userLower = userAnswer.toLowerCase().trim();
    const correctLower = correctAnswer.toLowerCase().trim();
    
    // Direct match
    if (userLower === correctLower) {
        return true;
    }
    
    if (questionType === 'college') {
        return checkCollegeAnswer(userLower, correctLower);
    } else if (questionType === 'jersey') {
        return checkJerseyAnswer(userAnswer, correctAnswer);
    }
    
    return false;
}

function checkCollegeAnswer(userAnswer, correctAnswer) {
    // College name variations mapping
    const collegeVariations = {
        // Ohio State variations
        'ohio state university': ['ohio state', 'osu', 'the ohio state university'],
        'ohio state': ['ohio state university', 'osu', 'the ohio state university'],
        'osu': ['ohio state', 'ohio state university', 'the ohio state university'],
        
        // Alabama variations
        'university of alabama': ['alabama', 'bama', 'ua'],
        'alabama': ['university of alabama', 'bama', 'ua'],
        'bama': ['alabama', 'university of alabama', 'ua'],
        
        // USC variations
        'university of southern california': ['usc', 'southern california', 'southern cal'],
        'usc': ['university of southern california', 'southern california', 'southern cal'],
        'southern california': ['usc', 'university of southern california', 'southern cal'],
        
        // Michigan variations
        'university of michigan': ['michigan', 'u of m', 'um'],
        'michigan': ['university of michigan', 'u of m', 'um'],
        
        // Texas variations
        'university of texas': ['texas', 'ut', 'texas longhorns'],
        'texas': ['university of texas', 'ut', 'texas longhorns'],
        'ut': ['texas', 'university of texas', 'texas longhorns'],
        
        // Florida variations
        'university of florida': ['florida', 'uf', 'florida gators'],
        'florida': ['university of florida', 'uf', 'florida gators'],
        'uf': ['florida', 'university of florida', 'florida gators'],
        
        // Georgia variations
        'university of georgia': ['georgia', 'uga', 'georgia bulldogs'],
        'georgia': ['university of georgia', 'uga', 'georgia bulldogs'],
        'uga': ['georgia', 'university of georgia', 'georgia bulldogs'],
        
        // Notre Dame variations
        'university of notre dame': ['notre dame', 'nd'],
        'notre dame': ['university of notre dame', 'nd'],
        'nd': ['notre dame', 'university of notre dame'],
        
        // Penn State variations
        'pennsylvania state university': ['penn state', 'psu'],
        'penn state': ['pennsylvania state university', 'psu'],
        'psu': ['penn state', 'pennsylvania state university'],
        
        // LSU variations
        'louisiana state university': ['lsu', 'louisiana state'],
        'lsu': ['louisiana state university', 'louisiana state'],
        
        // California variations (UC Berkeley)
        'university of california berkeley': ['california', 'cal', 'cal berkeley', 'uc berkeley', 'berkeley'],
        'california': ['university of california berkeley', 'cal', 'cal berkeley', 'uc berkeley', 'berkeley'],
        'cal': ['california', 'university of california berkeley', 'cal berkeley', 'uc berkeley', 'berkeley'],
        'cal berkeley': ['california', 'university of california berkeley', 'cal', 'uc berkeley', 'berkeley'],
        'uc berkeley': ['california', 'university of california berkeley', 'cal', 'cal berkeley', 'berkeley'],
        'berkeley': ['california', 'university of california berkeley', 'cal', 'cal berkeley', 'uc berkeley'],
        
        // Duke variations
        'duke university': ['duke', 'duke blue devils'],
        'duke': ['duke university', 'duke blue devils'],
        
        // Kentucky variations
        'university of kentucky': ['kentucky', 'uk', 'kentucky wildcats'],
        'kentucky': ['university of kentucky', 'uk', 'kentucky wildcats'],
        'uk': ['kentucky', 'university of kentucky', 'kentucky wildcats'],
        
        // North Carolina variations
        'university of north carolina': ['north carolina', 'unc', 'unc chapel hill', 'tar heels'],
        'north carolina': ['university of north carolina', 'unc', 'unc chapel hill', 'tar heels'],
        'unc': ['north carolina', 'university of north carolina', 'unc chapel hill', 'tar heels'],
        'unc chapel hill': ['north carolina', 'university of north carolina', 'unc', 'tar heels'],
        
        // UCLA variations
        'university of california los angeles': ['ucla', 'los angeles', 'uc los angeles'],
        'ucla': ['university of california los angeles', 'los angeles', 'uc los angeles'],
        
        // Kansas variations
        'university of kansas': ['kansas', 'ku', 'kansas jayhawks'],
        'kansas': ['university of kansas', 'ku', 'kansas jayhawks'],
        'ku': ['kansas', 'university of kansas', 'kansas jayhawks'],
        
        // Syracuse variations
        'syracuse university': ['syracuse', 'cuse'],
        'syracuse': ['syracuse university', 'cuse'],
        'cuse': ['syracuse', 'syracuse university'],
        
        // UConn variations
        'university of connecticut': ['uconn', 'connecticut', 'ct'],
        'uconn': ['university of connecticut', 'connecticut', 'ct'],
        'connecticut': ['university of connecticut', 'uconn', 'ct'],
        
        // Add more as needed...
    };
    
    // Check if user answer matches correct answer or any of its variations
    if (userAnswer === correctAnswer) return true;
    
    const variations = collegeVariations[correctAnswer];
    if (variations && variations.includes(userAnswer)) return true;
    
    const userVariations = collegeVariations[userAnswer];
    if (userVariations && userVariations.includes(correctAnswer)) return true;
    
    return false;
}

function checkJerseyAnswer(userAnswer, correctAnswer) {
    // For jersey numbers, just check if the numeric values match
    const userNum = parseInt(userAnswer.replace(/\D/g, ''));
    const correctNum = parseInt(correctAnswer.toString().replace(/\D/g, ''));
    
    return userNum === correctNum && !isNaN(userNum) && !isNaN(correctNum);
}

// Player count function removed - no longer needed

// High Score Functions
function loadHighScore() {
    const highScore = localStorage.getItem('ballKnower_highScore');
    if (highScore) {
        const scoreData = JSON.parse(highScore);
        document.getElementById('best-streak').textContent = scoreData.streak;
        
        // Use display modes if available, otherwise convert modes
        const displayText = scoreData.displayModes ? 
            scoreData.displayModes.join(' + ') : 
            scoreData.modes.map(mode => {
                switch(mode) {
                    case 'college-guesser': return 'College';
                    case 'jersey-guesser': return 'Jersey';
                    case 'achievement-guesser': return 'Trivia';
                    default: return mode;
                }
            }).join(' + ');
            
        document.getElementById('best-mode').textContent = displayText;
    } else {
        document.getElementById('best-streak').textContent = '0';
        document.getElementById('best-mode').textContent = '-';
    }
}

function saveHighScore(streak, modes) {
    const currentHighScore = localStorage.getItem('ballKnower_highScore');
    let shouldSave = false;
    
    if (!currentHighScore) {
        shouldSave = true;
    } else {
        const scoreData = JSON.parse(currentHighScore);
        if (streak > scoreData.streak) {
            shouldSave = true;
        }
    }
    
    if (shouldSave) {
        // Convert mode names to display names
        const displayModes = modes.map(mode => {
            switch(mode) {
                case 'college-guesser': return 'College';
                case 'jersey-guesser': return 'Jersey';
                case 'achievement-guesser': return 'Trivia';
                default: return mode;
            }
        });
        
        const scoreData = {
            streak: streak,
            modes: modes,
            displayModes: displayModes,
            date: new Date().toISOString()
        };
        localStorage.setItem('ballKnower_highScore', JSON.stringify(scoreData));
        loadHighScore(); // Refresh display
        
        // Show achievement message for new high score
        showMessage(`🏆 New High Score: ${streak} streak!`, 'success');
    }
}

function getSelectedGameModes() {
    const modes = [];
    if (document.getElementById('college-mode').checked) modes.push('college-guesser');
    if (document.getElementById('jersey-mode').checked) modes.push('jersey-guesser');
    if (document.getElementById('trivia-mode').checked) modes.push('achievement-guesser');
    return modes;
}

function validateSurvivalSetup() {
    const selectedModes = getSelectedGameModes();
    if (selectedModes.length === 0) {
        showMessage('Please select at least one game mode for survival mode!', 'error');
        return false;
    }
    return true;
}

function changeQuestionCount(delta) {
    const currentCount = parseInt(document.getElementById('question-count').textContent);
    const newCount = Math.max(5, Math.min(50, currentCount + delta));
    document.getElementById('question-count').textContent = newCount;
    currentGame.questionCount = newCount;
}

// Game Session
async function startGameSession() {
    console.log(`🎬 startGameSession called - Current sport: ${currentGame.sport}`);
    
    // Validate survival mode setup
    if (currentGame.mode === 'survival' && !validateSurvivalSetup()) {
        return;
    }
    
    // Reset game state (but keep sport selection!)
    currentGame.currentQuestion = 0;
    currentGame.score = 0;
    currentGame.correctAnswers = 0;
    currentGame.streak = 0;
    currentGame.maxStreak = 0;
    currentGame.gameStartTime = Date.now();
    
    console.log(`📊 After reset - Current sport: ${currentGame.sport}`);
    

    // Remove loading message - questions load quickly now
    
    try {
        console.log(`🔄 About to generate questions - Current sport: ${currentGame.sport}`);
        // Generate questions (now async)
        currentGame.questions = await generateQuestions();
        
        if (currentGame.questions.length === 0) {
            showMessage('Failed to load questions. Please try again.', 'error');
            showHome();
            return;
        }
    
    // Update sport display
    const sportDisplay = document.getElementById('current-sport-display');
    if (sportDisplay) {
        sportDisplay.textContent = currentGame.sport.toUpperCase();
    }
    
    // Show game screen
    showScreen('game-screen');
    
    // Start first question
    startQuestion();
    } catch (error) {
        console.error('Failed to start game:', error);
        showMessage('Failed to start game. Please try again.', 'error');
        showHome();
    }
}

async function generateQuestions() {
    console.log(`🎮 Generating questions for sport: ${currentGame.sport}`);
    
    // Load well-known players from Excel file based on selected sport
    const players = await dataLoader.loadPlayers(currentGame.sport);
    
    if (players.length === 0) {
        console.error('No well-known players loaded for sport:', currentGame.sport);
        return [];
    }
    
    console.log(`✅ Loaded ${players.length} players for ${currentGame.sport}`);
    
    const questions = [];
    
    // Fisher-Yates shuffle for better randomization
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Shuffle players to ensure good randomization - fresh shuffle each game
    const shuffledPlayers = shuffleArray(players);
    
    // For survival mode, generate unlimited questions with mixed modes
    const questionCount = currentGame.mode === 'survival' ? 1000 : currentGame.questionCount;
    
    // For survival mode with multiple modes/sports, create a balanced mix
    let modeRotation = [];
    if (currentGame.mode === 'survival') {
        const selectedModes = getSelectedGameModes();
        if (selectedModes.length === 0) {
            console.error('No game modes selected for survival mode');
            return [];
        }
        
        // Create a rotation array that evenly distributes modes
        // For example: [college, jersey, trivia, college, jersey, trivia, ...]
        for (let i = 0; i < questionCount; i++) {
            modeRotation.push(selectedModes[i % selectedModes.length]);
        }
        // Shuffle the rotation to randomize order while keeping even distribution
        modeRotation = shuffleArray(modeRotation);
    }
    
    // Pre-load trivia questions if needed
    let triviaQuestions = [];
    if (currentGame.mode === 'achievement-guesser' || 
        (currentGame.mode === 'survival' && modeRotation.includes('achievement-guesser'))) {
        console.log(`🎯 Loading trivia for mode: ${currentGame.mode}, sport: ${currentGame.sport}`);
        
        try {
            // Load trivia questions based on selected sport
            if (currentGame.sport === 'both') {
                // Load both NFL and NBA trivia
                const nflTriviaQuestions = await dataLoader.loadTriviaQuestions('nfl');
                const nbaTriviaQuestions = await dataLoader.loadTriviaQuestions('nba');
                triviaQuestions = [...nflTriviaQuestions, ...nbaTriviaQuestions];
                console.log(`📚 Loaded combined trivia: ${nflTriviaQuestions.length} NFL + ${nbaTriviaQuestions.length} NBA = ${triviaQuestions.length} total`);
            } else {
                // Load single sport trivia
                triviaQuestions = await dataLoader.loadTriviaQuestions(currentGame.sport);
                console.log(`📚 Loaded ${currentGame.sport.toUpperCase()} trivia: ${triviaQuestions.length} questions`);
            }
            // Shuffle trivia questions
            triviaQuestions = shuffleArray(triviaQuestions);
            console.log(`🎲 Shuffled ${triviaQuestions.length} trivia questions`);
        } catch (error) {
            console.error('❌ Error loading trivia questions:', error);
        }
    }
    
    let triviaIndex = 0;
    
    for (let i = 0; i < questionCount; i++) {
        // Re-shuffle periodically to ensure variety across many questions
        const playerIndex = i % shuffledPlayers.length;
        if (playerIndex === 0 && i > 0) {
            // Re-shuffle when we've used all players once
            shuffleArray(shuffledPlayers);
        }
        
        const player = shuffledPlayers[playerIndex];
        let question = null;
        
        // Generate different question types based on game mode
        if (currentGame.mode === 'college-guesser') {
            question = dataLoader.createCollegeQuestionWithPlayer(player, players);
        } else if (currentGame.mode === 'jersey-guesser') {
            question = dataLoader.createJerseyQuestionWithPlayer(player, players);
        } else if (currentGame.mode === 'achievement-guesser') {
            // General Trivia mode - use trivia questions
            if (triviaQuestions.length > 0) {
                const triviaQ = triviaQuestions[triviaIndex % triviaQuestions.length];
                triviaIndex++;
                
                const options = triviaQ.choices.map(choice => choice.text);
                const correctAnswer = triviaQ.choices.find(c => c.id === triviaQ.correctChoiceId)?.text;
                
                question = {
                    type: 'trivia',
                    question: triviaQ.question,
                    options: options,
                    correctAnswer: correctAnswer,
                    category: triviaQ.category || 'General',
                    difficulty: triviaQ.difficulty || 'medium'
                };
            }
        } else if (currentGame.mode === 'survival') {
            // Use the pre-shuffled, evenly distributed mode rotation
            const selectedMode = modeRotation[i];
            
            if (selectedMode === 'college-guesser') {
                question = dataLoader.createCollegeQuestionWithPlayer(player, players);
            } else if (selectedMode === 'jersey-guesser') {
                question = dataLoader.createJerseyQuestionWithPlayer(player, players);
            } else if (selectedMode === 'achievement-guesser') {
                // General Trivia - use real trivia questions
                if (triviaQuestions.length > 0) {
                    const triviaQ = triviaQuestions[triviaIndex % triviaQuestions.length];
                    triviaIndex++;
                    
                    const options = triviaQ.choices.map(choice => choice.text);
                    const correctAnswer = triviaQ.choices.find(c => c.id === triviaQ.correctChoiceId)?.text;
                    
                    question = {
                        type: 'trivia',
                        question: triviaQ.question,
                        options: options,
                        correctAnswer: correctAnswer,
                        category: triviaQ.category || 'General',
                        difficulty: triviaQ.difficulty || 'medium'
                    };
                }
            }
        } else {
            // Default to college questions for now
            question = dataLoader.createCollegeQuestionWithPlayer(player, players);
        }
        
        if (question) {
            questions.push(question);
        }
    }
    
    return questions;
}

function getPlayersForSport() {
    // Generate players from householdNames list
    const players = [];
    
    householdNames.forEach(name => {
        const player = generatePlayerData(name);
        players.push(player);
    });
    
    // Filter by difficulty - all players are modern (2010+)
        return players.filter(player => player.era === 'modern');
}

function generatePlayerData(playerName) {
    const position = getPlayerPosition(playerName);
    const era = getPlayerEra(playerName);
    const team = getPlayerTeam(playerName);
    const college = getPlayerCollege(playerName);
    const jerseyNumber = generateJerseyNumber(position, playerName);
    const popularity = calculateGeneratedPopularity(playerName, position, era);
    const facts = generatePlayerFacts(playerName, position, team, college);
    
    return {
        name: playerName,
        position: position,
        era: era,
        team: team,
        college: college,
        jerseyNumber: jerseyNumber,
        popularity: popularity,
        facts: facts
    };
}

function getPlayerPosition(playerName) {
    const qbNames = ['Tom Brady', 'Aaron Rodgers', 'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Dak Prescott', 'Justin Herbert', 'Peyton Manning', 'Drew Brees', 'Brett Favre', 'Eli Manning', 'Ben Roethlisberger', 'Russell Wilson', 'Matt Ryan', 'Philip Rivers', 'Matthew Stafford', 'Kirk Cousins', 'Cam Newton', 'Andrew Luck', 'Jalen Hurts', 'Tua Tagovailoa', 'Trevor Lawrence'];
    const rbNames = ['Derrick Henry', 'Saquon Barkley', 'Ezekiel Elliott', 'Christian McCaffrey', 'Alvin Kamara', 'Nick Chubb', 'Dalvin Cook', 'Aaron Jones', 'Josh Jacobs', 'Jonathan Taylor', 'Austin Ekeler', 'Leonard Fournette', 'Joe Mixon', 'Miles Sanders', 'Tony Pollard', 'Todd Gurley', 'Le\'Veon Bell', 'David Johnson', 'Kareem Hunt', 'James Conner', 'Melvin Gordon', 'Mark Ingram', 'LeSean McCoy', 'Marshaun Lynch', 'Adrian Peterson', 'Frank Gore', 'Arian Foster', 'Jamaal Charles', 'LaDainian Tomlinson', 'Shaun Alexander', 'Priest Holmes', 'Clinton Portis', 'Edgerrin James', 'Marshall Faulk', 'Ricky Williams', 'Jamal Lewis', 'Corey Dillon', 'Warrick Dunn', 'Tony Dorsett', 'Marcus Allen', 'Thurman Thomas', 'Jerome Bettis', 'Curtis Martin', 'Barry Sanders', 'Emmitt Smith', 'Walter Payton', 'Jim Brown', 'Eric Dickerson'];
    const wrNames = ['Davante Adams', 'Tyreek Hill', 'Stefon Diggs', 'Cooper Kupp', 'Justin Jefferson', 'Ja\'Marr Chase', 'CeeDee Lamb', 'DK Metcalf', 'A.J. Brown', 'Terry McLaurin', 'D.J. Moore', 'Chris Godwin', 'Mike Williams', 'Brandin Cooks', 'Tyler Lockett', 'Robert Woods', 'Allen Robinson', 'Adam Thielen', 'Jarvis Landry', 'Julian Edelman', 'Emmanuel Sanders', 'Deebo Samuel', 'Amon-Ra St. Brown', 'Jaylen Waddle', 'Garrett Wilson', 'Drake London', 'Chris Olave', 'Tee Higgins', 'Marquise Brown', 'Courtland Sutton', 'Dionte Johnson', 'Larry Fitzgerald', 'Anquan Boldin', 'Reggie Wayne', 'Chad Johnson', 'Santana Moss', 'Plaxico Burress', 'Wes Welker', 'Victor Cruz', 'Hakeem Nicks', 'DeSean Jackson', 'Jeremy Maclin', 'Torrey Smith', 'Cris Carter', 'Marvin Harrison', 'Tim Brown', 'Isaac Bruce', 'Torry Holt', 'Hines Ward', 'Roddy White', 'Steve Smith Sr.', 'Mario Manningham', 'David Tyree', 'Tyler Boyd', 'Marvin Jones', 'Kenny Golladay', 'Allen Lazard', 'Russell Gage', 'Kendrick Bourne', 'Jakobi Meyers', 'Hunter Renfrow', 'Cole Beasley', 'Golden Tate', 'Amari Cooper', 'Michael Thomas', 'Keenan Allen', 'DeAndre Hopkins', 'Antonio Brown', 'Odell Beckham Jr.', 'Mike Evans'];
    const teNames = ['Travis Kelce', 'George Kittle', 'Rob Gronkowski', 'Mark Andrews', 'Darren Waller', 'Kyle Pitts', 'T.J. Hockenson', 'Dalton Kincaid', 'Pat Freiermuth', 'Evan Engram', 'Zach Ertz', 'Tyler Higbee', 'Hunter Henry', 'Dallas Goedert', 'Noah Fant', 'Jimmy Graham', 'Antonio Gates', 'Jason Witten', 'Greg Olsen', 'Jared Cook', 'Tony Gonzalez', 'Shannon Sharpe', 'Kellen Winslow', 'Ozzie Newsome', 'Mike Ditka', 'Dave Casper', 'John Mackey', 'Charlie Sanders', 'Jackie Smith', 'Raymond Chester', 'Vernon Davis', 'Brent Celek', 'Heath Miller', 'Dallas Clark', 'Todd Heap', 'Jeremy Shockey', 'Alge Crumpler', 'Chris Cooley'];
    
    if (qbNames.includes(playerName)) return 'QB';
    if (rbNames.includes(playerName)) return 'RB';
    if (wrNames.includes(playerName)) return 'WR';
    if (teNames.includes(playerName)) return 'TE';
    return 'WR'; // Default
}

function getPlayerEra(playerName) {
    // Pre-2010 players (Ball Historian mode)
    const historicalPlayers = [
        // QBs
        'Jerry Rice', 'Barry Sanders', 'Emmitt Smith', 'Walter Payton', 'Jim Brown', 'Joe Montana', 
        'John Elway', 'Dan Marino', 'Steve Young', 'Troy Aikman', 'Terry Bradshaw', 'Joe Namath', 
        'Johnny Unitas', 'Otto Graham', 'Sammy Baugh', 'Bart Starr', 'Roger Staubach', 'Fran Tarkenton', 
        'Dan Fouts', 'Warren Moon', 'Jim Kelly', 'Boomer Esiason', 'Randall Cunningham', 'Steve McNair',
        'Donovan McNabb', 'Daunte Culpepper', 'Michael Vick', 'Chad Pennington', 'Matt Schaub', 'Jay Cutler',
        'Tony Romo', 'Carson Palmer', 'Alex Smith', 'Joe Flacco', 'Josh McCown', 'Nick Foles', 'Case Keenum',
        'Dwayne Haskins', 'Josh Rosen', 'Jameis Winston', 'Marcus Mariota', 'Blake Bortles', 'Mitchell Trubisky',
        'Sam Darnold', 'Kenny Pickett', 'Justin Fields', 'Tua Tagovailoa', 'Jimmy Garoppolo', 'Geno Smith',
        'Will Levis', 'Bryce Young', 'Anthony Richardson', 'Brock Purdy', 'Zach Wilson', 'Mac Jones',
        'Jalen Hurts', 'Deshaun Watson', 'Derek Carr', 'Daniel Jones', 'Jared Goff', 'Carson Wentz',
        'Baker Mayfield', 'Ryan Fitzpatrick', 'Andy Dalton', 'Case Keenum', 'Nick Foles', 'Josh McCown',
        'Tony Romo', 'Carson Palmer', 'Alex Smith', 'Joe Flacco', 'Jay Cutler', 'Matt Schaub',
        'Chad Pennington', 'Donovan McNabb', 'Michael Vick', 'Daunte Culpepper', 'Marc Bulger',
        'Jake Delhomme', 'Kerry Collins', 'Kurt Warner', 'Matt Hasselbeck', 'David Garrard',
        'Jason Campbell', 'Trent Edwards', 'Brady Quinn', 'JaMarcus Russell', 'Matt Leinart',
        'Vince Young', 'Matt Cassel', 'Tyler Thigpen', 'Seneca Wallace', 'Sage Rosenfels',
        'Gus Frerotte', 'Jeff Garcia',
        
        // RBs
        'LaDainian Tomlinson', 'Shaun Alexander', 'Priest Holmes', 'Clinton Portis', 'Edgerrin James',
        'Marshall Faulk', 'Ricky Williams', 'Jamal Lewis', 'Corey Dillon', 'Warrick Dunn',
        'Tony Dorsett', 'Marcus Allen', 'Thurman Thomas', 'Jerome Bettis', 'Curtis Martin',
        'Barry Sanders', 'Emmitt Smith', 'Walter Payton', 'Jim Brown', 'Eric Dickerson',
        
        // WRs
        'Larry Fitzgerald', 'Anquan Boldin', 'Reggie Wayne', 'Chad Johnson', 'Santana Moss',
        'Plaxico Burress', 'Wes Welker', 'Victor Cruz', 'Hakeem Nicks', 'DeSean Jackson',
        'Jeremy Maclin', 'Torrey Smith', 'Cris Carter', 'Marvin Harrison', 'Tim Brown',
        'Isaac Bruce', 'Torry Holt', 'Hines Ward', 'Roddy White', 'Steve Smith Sr.',
        'Mario Manningham', 'David Tyree', 'Allen Robinson', 'Adam Thielen', 'Jarvis Landry',
        'Julian Edelman', 'Emmanuel Sanders',
        
        // TEs
        'Tony Gonzalez', 'Shannon Sharpe', 'Kellen Winslow', 'Ozzie Newsome', 'Mike Ditka',
        'Dave Casper', 'John Mackey', 'Charlie Sanders', 'Jackie Smith', 'Raymond Chester',
        'Vernon Davis', 'Brent Celek', 'Heath Miller', 'Dallas Clark', 'Todd Heap',
        'Jeremy Shockey', 'Alge Crumpler', 'Chris Cooley',
        
        // Defense
        'Lawrence Taylor', 'Reggie White', 'Bruce Smith', 'Deion Sanders', 'Ronnie Lott',
        'Dick Butkus', 'Ray Lewis', 'Brian Urlacher', 'Junior Seau', 'Derrick Thomas',
        'Michael Strahan', 'Warren Sapp', 'John Randle', 'Cortez Kennedy', 'Simeon Rice',
        'Champ Bailey', 'Charles Woodson', 'Darren Woodson', 'Rod Woodson', 'J.J. Watt',
        'Ed Reed', 'Troy Polamalu', 'Richard Sherman',
        
        // Special Teams
        'Devin Hester', 'Darren Sproles', 'Cordarrelle Patterson', 'Dante Hall', 'Josh Cribbs',
        'Andre Roberts', 'Tarik Cohen', 'Nyheim Hines'
    ];
    
    if (historicalPlayers.includes(playerName)) return 'historical';
    return 'modern';
}

function getPlayerTeam(playerName) {
    // Try API data first for modern players
    if (apiPlayerData.has(playerName)) {
        const apiData = apiPlayerData.get(playerName);
        if (apiData.team && apiData.team !== 'Unknown Team' && apiData.team !== 'Free Agent') {
            return apiData.team;
        }
    }
    
    // Fallback to hardcoded data
    // Real team information for players
    const playerTeams = {
        // QBs
        'Tom Brady': 'Tampa Bay Buccaneers',
        'Aaron Rodgers': 'New York Jets',
        'Patrick Mahomes': 'Kansas City Chiefs',
        'Josh Allen': 'Buffalo Bills',
        'Lamar Jackson': 'Baltimore Ravens',
        'Joe Burrow': 'Cincinnati Bengals',
        'Dak Prescott': 'Dallas Cowboys',
        'Justin Herbert': 'Los Angeles Chargers',
        'Peyton Manning': 'Denver Broncos',
        'Drew Brees': 'New Orleans Saints',
        'Brett Favre': 'Green Bay Packers',
        'Eli Manning': 'New York Giants',
        'Ben Roethlisberger': 'Pittsburgh Steelers',
        'Russell Wilson': 'Denver Broncos',
        'Matt Ryan': 'Atlanta Falcons',
        'Philip Rivers': 'Los Angeles Chargers',
        'Matthew Stafford': 'Detroit Lions',
        'Kirk Cousins': 'Minnesota Vikings',
        'Cam Newton': 'Carolina Panthers',
        'Andrew Luck': 'Indianapolis Colts',
        'Jalen Hurts': 'Philadelphia Eagles',
        'Tua Tagovailoa': 'Miami Dolphins',
        'Trevor Lawrence': 'Jacksonville Jaguars',
        
        // RBs
        'Derrick Henry': 'Tennessee Titans',
        'Saquon Barkley': 'New York Giants',
        'Ezekiel Elliott': 'Dallas Cowboys',
        'Christian McCaffrey': 'San Francisco 49ers',
        'Alvin Kamara': 'New Orleans Saints',
        'Nick Chubb': 'Cleveland Browns',
        'Dalvin Cook': 'Minnesota Vikings',
        'Aaron Jones': 'Green Bay Packers',
        'Josh Jacobs': 'Las Vegas Raiders',
        'Jonathan Taylor': 'Indianapolis Colts',
        'Austin Ekeler': 'Los Angeles Chargers',
        'Leonard Fournette': 'Tampa Bay Buccaneers',
        'Joe Mixon': 'Cincinnati Bengals',
        'Miles Sanders': 'Philadelphia Eagles',
        'Tony Pollard': 'Dallas Cowboys',
        'Todd Gurley': 'Los Angeles Rams',
        'Le\'Veon Bell': 'Pittsburgh Steelers',
        'David Johnson': 'Arizona Cardinals',
        'Kareem Hunt': 'Cleveland Browns',
        'James Conner': 'Pittsburgh Steelers',
        'Melvin Gordon': 'Denver Broncos',
        'Mark Ingram': 'New Orleans Saints',
        'LeSean McCoy': 'Buffalo Bills',
        'Marshaun Lynch': 'Seattle Seahawks',
        'Adrian Peterson': 'Minnesota Vikings',
        'Frank Gore': 'San Francisco 49ers',
        'Arian Foster': 'Houston Texans',
        'Jamaal Charles': 'Kansas City Chiefs',
        'LaDainian Tomlinson': 'San Diego Chargers',
        'Shaun Alexander': 'Seattle Seahawks',
        'Priest Holmes': 'Kansas City Chiefs',
        'Clinton Portis': 'Washington Redskins',
        'Edgerrin James': 'Indianapolis Colts',
        'Marshall Faulk': 'St. Louis Rams',
        'Ricky Williams': 'Miami Dolphins',
        'Jamal Lewis': 'Baltimore Ravens',
        'Corey Dillon': 'New England Patriots',
        'Warrick Dunn': 'Atlanta Falcons',
        'Tony Dorsett': 'Dallas Cowboys',
        'Marcus Allen': 'Los Angeles Raiders',
        'Thurman Thomas': 'Buffalo Bills',
        'Jerome Bettis': 'Pittsburgh Steelers',
        'Curtis Martin': 'New York Jets',
        'Barry Sanders': 'Detroit Lions',
        'Emmitt Smith': 'Dallas Cowboys',
        'Walter Payton': 'Chicago Bears',
        'Jim Brown': 'Cleveland Browns',
        'Eric Dickerson': 'Los Angeles Rams',
        
        // WRs
        'Davante Adams': 'Las Vegas Raiders',
        'Tyreek Hill': 'Miami Dolphins',
        'Stefon Diggs': 'Buffalo Bills',
        'Cooper Kupp': 'Los Angeles Rams',
        'Justin Jefferson': 'Minnesota Vikings',
        'Ja\'Marr Chase': 'Cincinnati Bengals',
        'CeeDee Lamb': 'Dallas Cowboys',
        'DK Metcalf': 'Seattle Seahawks',
        'A.J. Brown': 'Philadelphia Eagles',
        'Terry McLaurin': 'Washington Commanders',
        'D.J. Moore': 'Carolina Panthers',
        'Chris Godwin': 'Tampa Bay Buccaneers',
        'Mike Williams': 'Los Angeles Chargers',
        'Brandin Cooks': 'Houston Texans',
        'Tyler Lockett': 'Seattle Seahawks',
        'Robert Woods': 'Los Angeles Rams',
        'Allen Robinson': 'Chicago Bears',
        'Adam Thielen': 'Minnesota Vikings',
        'Jarvis Landry': 'Cleveland Browns',
        'Julian Edelman': 'New England Patriots',
        'Emmanuel Sanders': 'Buffalo Bills',
        'Deebo Samuel': 'San Francisco 49ers',
        'Amon-Ra St. Brown': 'Detroit Lions',
        'Jaylen Waddle': 'Miami Dolphins',
        'Garrett Wilson': 'New York Jets',
        'Drake London': 'Atlanta Falcons',
        'Chris Olave': 'New Orleans Saints',
        'Tee Higgins': 'Cincinnati Bengals',
        'Marquise Brown': 'Arizona Cardinals',
        'Courtland Sutton': 'Denver Broncos',
        'Dionte Johnson': 'Pittsburgh Steelers',
        'Larry Fitzgerald': 'Arizona Cardinals',
        'Anquan Boldin': 'Arizona Cardinals',
        'Reggie Wayne': 'Indianapolis Colts',
        'Chad Johnson': 'Cincinnati Bengals',
        'Santana Moss': 'Washington Redskins',
        'Plaxico Burress': 'New York Giants',
        'Wes Welker': 'New England Patriots',
        'Victor Cruz': 'New York Giants',
        'Hakeem Nicks': 'New York Giants',
        'DeSean Jackson': 'Philadelphia Eagles',
        'Jeremy Maclin': 'Philadelphia Eagles',
        'Torrey Smith': 'Baltimore Ravens',
        'Cris Carter': 'Minnesota Vikings',
        'Marvin Harrison': 'Indianapolis Colts',
        'Tim Brown': 'Oakland Raiders',
        'Isaac Bruce': 'St. Louis Rams',
        'Torry Holt': 'St. Louis Rams',
        'Hines Ward': 'Pittsburgh Steelers',
        'Roddy White': 'Atlanta Falcons',
        'Steve Smith Sr.': 'Carolina Panthers',
        'Mario Manningham': 'New York Giants',
        'David Tyree': 'New York Giants',
        'Tyler Boyd': 'Cincinnati Bengals',
        'Marvin Jones': 'Detroit Lions',
        'Kenny Golladay': 'New York Giants',
        'Allen Lazard': 'Green Bay Packers',
        'Russell Gage': 'Tampa Bay Buccaneers',
        'Kendrick Bourne': 'New England Patriots',
        'Jakobi Meyers': 'Las Vegas Raiders',
        'Hunter Renfrow': 'Las Vegas Raiders',
        'Cole Beasley': 'Buffalo Bills',
        'Golden Tate': 'Detroit Lions',
        'Amari Cooper': 'Dallas Cowboys',
        'Michael Thomas': 'New Orleans Saints',
        'Keenan Allen': 'Los Angeles Chargers',
        'DeAndre Hopkins': 'Arizona Cardinals',
        'Antonio Brown': 'Tampa Bay Buccaneers',
        'Odell Beckham Jr.': 'Baltimore Ravens',
        'Mike Evans': 'Tampa Bay Buccaneers',
        
        // TEs
        'Travis Kelce': 'Kansas City Chiefs',
        'George Kittle': 'San Francisco 49ers',
        'Rob Gronkowski': 'Tampa Bay Buccaneers',
        'Mark Andrews': 'Baltimore Ravens',
        'Darren Waller': 'Las Vegas Raiders',
        'Kyle Pitts': 'Atlanta Falcons',
        'T.J. Hockenson': 'Detroit Lions',
        'Dalton Kincaid': 'Buffalo Bills',
        'Pat Freiermuth': 'Pittsburgh Steelers',
        'Evan Engram': 'Jacksonville Jaguars',
        'Zach Ertz': 'Arizona Cardinals',
        'Tyler Higbee': 'Los Angeles Rams',
        'Hunter Henry': 'New England Patriots',
        'Dallas Goedert': 'Philadelphia Eagles',
        'Noah Fant': 'Seattle Seahawks',
        'Jimmy Graham': 'New Orleans Saints',
        'Antonio Gates': 'San Diego Chargers',
        'Jason Witten': 'Dallas Cowboys',
        'Greg Olsen': 'Carolina Panthers',
        'Jared Cook': 'New Orleans Saints',
        'Tony Gonzalez': 'Kansas City Chiefs',
        'Shannon Sharpe': 'Denver Broncos',
        'Kellen Winslow': 'San Diego Chargers',
        'Ozzie Newsome': 'Cleveland Browns',
        'Mike Ditka': 'Chicago Bears',
        'Dave Casper': 'Oakland Raiders',
        'John Mackey': 'Baltimore Colts',
        'Charlie Sanders': 'Detroit Lions',
        'Jackie Smith': 'St. Louis Cardinals',
        'Raymond Chester': 'Oakland Raiders',
        'Vernon Davis': 'San Francisco 49ers',
        'Brent Celek': 'Philadelphia Eagles',
        'Heath Miller': 'Pittsburgh Steelers',
        'Dallas Clark': 'Indianapolis Colts',
        'Todd Heap': 'Baltimore Ravens',
        'Jeremy Shockey': 'New York Giants',
        'Alge Crumpler': 'Atlanta Falcons',
        'Chris Cooley': 'Washington Redskins',
        
        // Defense
        'Lawrence Taylor': 'New York Giants',
        'Reggie White': 'Green Bay Packers',
        'Bruce Smith': 'Buffalo Bills',
        'Deion Sanders': 'Dallas Cowboys',
        'Ronnie Lott': 'San Francisco 49ers',
        'Dick Butkus': 'Chicago Bears',
        'Ray Lewis': 'Baltimore Ravens',
        'Brian Urlacher': 'Chicago Bears',
        'Junior Seau': 'San Diego Chargers',
        'Derrick Thomas': 'Kansas City Chiefs',
        'Michael Strahan': 'New York Giants',
        'Warren Sapp': 'Tampa Bay Buccaneers',
        'John Randle': 'Minnesota Vikings',
        'Cortez Kennedy': 'Seattle Seahawks',
        'Simeon Rice': 'Tampa Bay Buccaneers',
        'Champ Bailey': 'Denver Broncos',
        'Charles Woodson': 'Green Bay Packers',
        'Darren Woodson': 'Dallas Cowboys',
        'Rod Woodson': 'Pittsburgh Steelers',
        'J.J. Watt': 'Arizona Cardinals',
        'Aaron Donald': 'Los Angeles Rams',
        'Khalil Mack': 'Chicago Bears',
        'Von Miller': 'Buffalo Bills',
        'T.J. Watt': 'Pittsburgh Steelers',
        'Myles Garrett': 'Cleveland Browns',
        'Nick Bosa': 'San Francisco 49ers',
        'Joey Bosa': 'Los Angeles Chargers',
        'Chandler Jones': 'Las Vegas Raiders',
        'Luke Kuechly': 'Carolina Panthers',
        'Bobby Wagner': 'Seattle Seahawks',
        'Micah Parsons': 'Dallas Cowboys',
        'Darius Leonard': 'Indianapolis Colts',
        'Fred Warner': 'San Francisco 49ers',
        'Roquan Smith': 'Chicago Bears',
        'Devin White': 'Tampa Bay Buccaneers',
        'Trevon Diggs': 'Dallas Cowboys',
        'Jalen Ramsey': 'Miami Dolphins',
        'Stefon Gilmore': 'Dallas Cowboys',
        'Xavien Howard': 'Miami Dolphins',
        'Jaire Alexander': 'Green Bay Packers',
        'Derwin James': 'Los Angeles Chargers',
        'Minkah Fitzpatrick': 'Pittsburgh Steelers',
        'Tyrann Mathieu': 'New Orleans Saints',
        'Harrison Smith': 'Minnesota Vikings',
        'Jamal Adams': 'Seattle Seahawks',
        'Ed Reed': 'Baltimore Ravens',
        'Troy Polamalu': 'Pittsburgh Steelers',
        'Richard Sherman': 'Seattle Seahawks',
        'Sauce Gardner': 'New York Jets',
        'Pat Surtain II': 'Denver Broncos',
        'Denzel Ward': 'Cleveland Browns',
        'Marshon Lattimore': 'New Orleans Saints',
        'Darius Slay': 'Philadelphia Eagles',
        'Marlon Humphrey': 'Baltimore Ravens',
        'Marcus Peters': 'Las Vegas Raiders',
        'A.J. Terrell': 'Atlanta Falcons',
        'Tariq Woolen': 'Seattle Seahawks',
        'Trent McDuffie': 'Kansas City Chiefs',
        'Kaiir Elam': 'Buffalo Bills',
        'Derek Stingley Jr.': 'Houston Texans',
        'Ahmad Gardner': 'New York Jets',
        'DeMarcus Lawrence': 'Dallas Cowboys',
        
        // Special Teams
        'Devin Hester': 'Chicago Bears',
        'Darren Sproles': 'Philadelphia Eagles',
        'Cordarrelle Patterson': 'Atlanta Falcons',
        'Jakeem Grant': 'Cleveland Browns',
        'Dante Hall': 'Kansas City Chiefs',
        'Josh Cribbs': 'Cleveland Browns',
        'Andre Roberts': 'Houston Texans',
        'Tarik Cohen': 'Chicago Bears',
        'Nyheim Hines': 'Buffalo Bills',
        
        // Current Players (2020-2024)
        'C.J. Stroud': 'Houston Texans',
        'Anthony Richardson': 'Indianapolis Colts',
        'Bryce Young': 'Carolina Panthers',
        'Brock Purdy': 'San Francisco 49ers',
        'Breece Hall': 'New York Jets',
        'Bijan Robinson': 'Atlanta Falcons',
        'Jahmyr Gibbs': 'Detroit Lions',
        'Kenneth Walker III': 'Seattle Seahawks',
        'Rachaad White': 'Tampa Bay Buccaneers',
        'Isiah Pacheco': 'Kansas City Chiefs',
        'Rhamondre Stevenson': 'New England Patriots',
        'Travis Etienne': 'Jacksonville Jaguars',
        'Dameon Pierce': 'Houston Texans',
        'J.K. Dobbins': 'Baltimore Ravens',
        'Cam Akers': 'Minnesota Vikings',
        'D\'Andre Swift': 'Chicago Bears',
        'Javonte Williams': 'Denver Broncos',
        'Najee Harris': 'Pittsburgh Steelers',
        'Antonio Gibson': 'New England Patriots',
        'Puka Nacua': 'Los Angeles Rams',
        'Tank Dell': 'Houston Texans',
        'Zay Flowers': 'Baltimore Ravens',
        'Jordan Addison': 'Minnesota Vikings',
        'Jaxon Smith-Njigba': 'Seattle Seahawks',
        'Quentin Johnston': 'Los Angeles Chargers',
        'Marvin Mims': 'Denver Broncos',
        'Josh Downs': 'Indianapolis Colts',
        'Jayden Reed': 'Green Bay Packers',
        'Rashee Rice': 'Kansas City Chiefs',
        'Sam LaPorta': 'Detroit Lions',
        'Jake Ferguson': 'Dallas Cowboys',
        'Tucker Kraft': 'Green Bay Packers',
        'Luke Musgrave': 'Green Bay Packers',
        'Michael Mayer': 'Las Vegas Raiders',
        'Brenton Strange': 'Jacksonville Jaguars',
        'Darnell Washington': 'Pittsburgh Steelers',
        'Luke Schoonmaker': 'Dallas Cowboys',
        'Cade Otton': 'Tampa Bay Buccaneers',
        'Isaiah Likely': 'Baltimore Ravens',
        'Trey McBride': 'Arizona Cardinals',
        'Cole Kmet': 'Chicago Bears',
        'David Njoku': 'Cleveland Browns',
        'Gerald Everett': 'Los Angeles Chargers',
        'Tyler Conklin': 'New York Jets',
        'Hayden Hurst': 'Carolina Panthers',
        'Mike Gesicki': 'Cincinnati Bengals',
        'Austin Hooper': 'Las Vegas Raiders',
        'Jonnu Smith': 'Miami Dolphins',
        'Logan Thomas': 'Washington Commanders',
        'Mo Alie-Cox': 'Indianapolis Colts',
        'Foster Moreau': 'New Orleans Saints',
        'Harrison Bryant': 'Cleveland Browns',
        'Adam Trautman': 'Denver Broncos',
        'Drew Sample': 'Cincinnati Bengals',
        'Kylen Granson': 'Indianapolis Colts',
        'Chris Jones': 'Kansas City Chiefs',
        'Quinnen Williams': 'New York Jets',
        'Jeffery Simmons': 'Tennessee Titans',
        'Dexter Lawrence': 'New York Giants',
        'Vita Vea': 'Tampa Bay Buccaneers',
        'Derrick Brown': 'Carolina Panthers',
        'Javon Kinlaw': 'New York Jets',
        'Rashan Gary': 'Green Bay Packers',
        'Montez Sweat': 'Chicago Bears',
        'Josh Allen': 'Jacksonville Jaguars',
        'Brian Burns': 'New York Giants',
        'Maxx Crosby': 'Las Vegas Raiders',
        'Trey Hendrickson': 'Cincinnati Bengals',
        'Danielle Hunter': 'Houston Texans',
        'Cameron Jordan': 'New Orleans Saints',
        'Calais Campbell': 'Miami Dolphins',
        'Fletcher Cox': 'Philadelphia Eagles',
        'Grady Jarrett': 'Atlanta Falcons',
        'Kenny Clark': 'Green Bay Packers',
        'Arik Armstead': 'Jacksonville Jaguars',
        'DeForest Buckner': 'Indianapolis Colts',
        'Jalen Carter': 'Philadelphia Eagles',
        'Will Anderson Jr.': 'Houston Texans',
        'Tyree Wilson': 'Las Vegas Raiders',
        'Lukas Van Ness': 'Green Bay Packers',
        'Felix Anudike-Uzomah': 'Kansas City Chiefs',
        'Myles Murphy': 'Cincinnati Bengals',
        'Keion White': 'New England Patriots',
        'Adetomiwa Adebawore': 'Indianapolis Colts',
        'Bryan Bresee': 'New Orleans Saints',
        'Mazi Smith': 'Dallas Cowboys',
        'Keeanu Benton': 'Pittsburgh Steelers',
        'Gervon Dexter': 'Chicago Bears',
        'Zach Harrison': 'Atlanta Falcons',
        'Tuli Tuipulotu': 'Los Angeles Chargers',
        'Byron Young': 'Los Angeles Rams',
        'Derick Hall': 'Seattle Seahawks',
        'Isaiah Foskey': 'New Orleans Saints',
        'Will McDonald IV': 'New York Jets',
        'BJ Ojulari': 'Arizona Cardinals',
        'Tyler Lacy': 'Jacksonville Jaguars',
        'Colby Wooden': 'Green Bay Packers',
        'Zach Pickens': 'Chicago Bears',
        'Kobie Turner': 'Los Angeles Rams',
        'Cameron Young': 'Cleveland Browns',
        'Jaquelin Roy': 'Seattle Seahawks',
        'Keondre Coburn': 'Houston Texans',
        'Dante Stills': 'Arizona Cardinals',
        'Karl Brooks': 'Green Bay Packers',
        'Zachary Carter': 'Cincinnati Bengals',
        'Jalen Redmond': 'New England Patriots',
        'Cory Trice Jr.': 'Pittsburgh Steelers',
        'Emmanuel Forbes': 'Washington Commanders',
        'Devon Witherspoon': 'Seattle Seahawks',
        'Christian Gonzalez': 'New England Patriots',
        'Joey Porter Jr.': 'Pittsburgh Steelers',
        'Deonte Banks': 'New York Giants',
        'Cam Smith': 'Miami Dolphins',
        'Kelee Ringo': 'Philadelphia Eagles',
        'Tyrique Stevenson': 'Chicago Bears',
        'Julius Brents': 'Indianapolis Colts',
        'Darius Rush': 'Kansas City Chiefs',
        'Riley Moss': 'Washington Commanders',
        'Terell Smith': 'Chicago Bears',
        'Jakorian Bennett': 'Las Vegas Raiders',
        'Kyu Blu Kelly': 'Indianapolis Colts',
        'Rejzohn Wright': 'Seattle Seahawks',
        'Alex Austin': 'Buffalo Bills',
        'Carrington Valentine': 'Cincinnati Bengals',
        'Jartavius Martin': 'Washington Commanders',
        
        // 2024 Rookies and Newer Players
        'Caleb Williams': 'Chicago Bears',
        'Jayden Daniels': 'Washington Commanders', 
        'Drake Maye': 'New England Patriots',
        'Bo Nix': 'Denver Broncos',
        'Michael Penix Jr.': 'Atlanta Falcons',
        'J.J. McCarthy': 'Minnesota Vikings',
        'Spencer Rattler': 'New Orleans Saints',
        'Malik Willis': 'Green Bay Packers',
        'Desmond Ridder': 'Arizona Cardinals',
        'Hendon Hooker': 'Detroit Lions',
        'Carson Strong': 'Free Agent',
        'Bailey Zappe': 'New England Patriots',
        'Skylar Thompson': 'Free Agent',
        'Sam Howell': 'Seattle Seahawks',
        'Tanner McKee': 'Philadelphia Eagles',
        'Clayton Tune': 'Arizona Cardinals',
        'Dorian Thompson-Robinson': 'Cleveland Browns',
        'Jaren Hall': 'Minnesota Vikings',
        'Stetson Bennett': 'Los Angeles Rams',
        'Jake Haener': 'New Orleans Saints'
    };
    
    return playerTeams[playerName] || 'Unknown Team';
}

function getPlayerCollege(playerName) {
    // Try API data first for modern players
    if (apiPlayerData.has(playerName)) {
        const apiData = apiPlayerData.get(playerName);
        if (apiData.college && apiData.college !== 'Unknown College') {
            return apiData.college;
        }
    }
    
    // Fallback to hardcoded data
    // Real college information for players
    const playerColleges = {
        // QBs
        'Tom Brady': 'Michigan',
        'Aaron Rodgers': 'California',
        'Patrick Mahomes': 'Texas Tech',
        'Josh Allen': 'Wyoming',
        'Lamar Jackson': 'Louisville',
        'Joe Burrow': 'LSU',
        'Dak Prescott': 'Mississippi State',
        'Justin Herbert': 'Oregon',
        'Peyton Manning': 'Tennessee',
        'Drew Brees': 'Purdue',
        'Brett Favre': 'Southern Miss',
        'Eli Manning': 'Ole Miss',
        'Ben Roethlisberger': 'Miami (OH)',
        'Russell Wilson': 'Wisconsin',
        'Matt Ryan': 'Boston College',
        'Philip Rivers': 'NC State',
        'Matthew Stafford': 'Georgia',
        'Kirk Cousins': 'Michigan State',
        'Cam Newton': 'Auburn',
        'Andrew Luck': 'Stanford',
        'Jalen Hurts': 'Oklahoma',
        'Tua Tagovailoa': 'Alabama',
        'Trevor Lawrence': 'Clemson',
        
        // RBs
        'Derrick Henry': 'Alabama',
        'Saquon Barkley': 'Penn State',
        'Ezekiel Elliott': 'Ohio State',
        'Christian McCaffrey': 'Stanford',
        'Alvin Kamara': 'Tennessee',
        'Nick Chubb': 'Georgia',
        'Dalvin Cook': 'Florida State',
        'Aaron Jones': 'UTEP',
        'Josh Jacobs': 'Alabama',
        'Jonathan Taylor': 'Wisconsin',
        'Austin Ekeler': 'Western State Colorado',
        'Leonard Fournette': 'LSU',
        'Joe Mixon': 'Oklahoma',
        'Miles Sanders': 'Penn State',
        'Tony Pollard': 'Memphis',
        'Todd Gurley': 'Georgia',
        'Le\'Veon Bell': 'Michigan State',
        'David Johnson': 'Northern Iowa',
        'Kareem Hunt': 'Toledo',
        'James Conner': 'Pitt',
        'Melvin Gordon': 'Wisconsin',
        'Mark Ingram': 'Alabama',
        'LeSean McCoy': 'Pitt',
        'Marshaun Lynch': 'California',
        'Adrian Peterson': 'Oklahoma',
        'Frank Gore': 'Miami',
        'Arian Foster': 'Tennessee',
        'Jamaal Charles': 'Texas',
        'LaDainian Tomlinson': 'TCU',
        'Shaun Alexander': 'Alabama',
        'Priest Holmes': 'Texas',
        'Clinton Portis': 'Miami',
        'Edgerrin James': 'Miami',
        'Marshall Faulk': 'San Diego State',
        'Ricky Williams': 'Texas',
        'Jamal Lewis': 'Tennessee',
        'Corey Dillon': 'Washington',
        'Warrick Dunn': 'Florida State',
        'Tony Dorsett': 'Pitt',
        'Marcus Allen': 'USC',
        'Thurman Thomas': 'Oklahoma State',
        'Jerome Bettis': 'Notre Dame',
        'Curtis Martin': 'Pitt',
        'Barry Sanders': 'Oklahoma State',
        'Emmitt Smith': 'Florida',
        'Walter Payton': 'Jackson State',
        'Jim Brown': 'Syracuse',
        'Eric Dickerson': 'SMU',
        
        // WRs
        'Davante Adams': 'Fresno State',
        'Tyreek Hill': 'West Alabama',
        'Stefon Diggs': 'Maryland',
        'Cooper Kupp': 'Eastern Washington',
        'Justin Jefferson': 'LSU',
        'Ja\'Marr Chase': 'LSU',
        'CeeDee Lamb': 'Oklahoma',
        'DK Metcalf': 'Ole Miss',
        'A.J. Brown': 'Ole Miss',
        'Terry McLaurin': 'Ohio State',
        'D.J. Moore': 'Maryland',
        'Chris Godwin': 'Penn State',
        'Mike Williams': 'Clemson',
        'Brandin Cooks': 'Oregon State',
        'Tyler Lockett': 'Kansas State',
        'Robert Woods': 'USC',
        'Allen Robinson': 'Penn State',
        'Adam Thielen': 'Minnesota State',
        'Jarvis Landry': 'LSU',
        'Julian Edelman': 'Kent State',
        'Emmanuel Sanders': 'SMU',
        'Deebo Samuel': 'South Carolina',
        'Amon-Ra St. Brown': 'USC',
        'Jaylen Waddle': 'Alabama',
        'Garrett Wilson': 'Ohio State',
        'Drake London': 'USC',
        'Chris Olave': 'Ohio State',
        'Tee Higgins': 'Clemson',
        'Marquise Brown': 'Oklahoma',
        'Courtland Sutton': 'SMU',
        'Dionte Johnson': 'Toledo',
        'Larry Fitzgerald': 'Pitt',
        'Anquan Boldin': 'Florida State',
        'Reggie Wayne': 'Miami',
        'Chad Johnson': 'Oregon State',
        'Santana Moss': 'Miami',
        'Plaxico Burress': 'Michigan State',
        'Wes Welker': 'Texas Tech',
        'Victor Cruz': 'UMass',
        'Hakeem Nicks': 'North Carolina',
        'DeSean Jackson': 'California',
        'Jeremy Maclin': 'Missouri',
        'Torrey Smith': 'Maryland',
        'Cris Carter': 'Ohio State',
        'Marvin Harrison': 'Syracuse',
        'Tim Brown': 'Notre Dame',
        'Isaac Bruce': 'Memphis',
        'Torry Holt': 'NC State',
        'Hines Ward': 'Georgia',
        'Roddy White': 'UAB',
        'Steve Smith Sr.': 'Utah',
        'Mario Manningham': 'Michigan',
        'David Tyree': 'Syracuse',
        'Tyler Boyd': 'Pitt',
        'Marvin Jones': 'California',
        'Kenny Golladay': 'Northern Illinois',
        'Allen Lazard': 'Iowa State',
        'Russell Gage': 'LSU',
        'Kendrick Bourne': 'Eastern Washington',
        'Jakobi Meyers': 'NC State',
        'Hunter Renfrow': 'Clemson',
        'Cole Beasley': 'SMU',
        'Golden Tate': 'Notre Dame',
        'Amari Cooper': 'Alabama',
        'Michael Thomas': 'Ohio State',
        'Keenan Allen': 'California',
        'DeAndre Hopkins': 'Clemson',
        'Antonio Brown': 'Central Michigan',
        'Odell Beckham Jr.': 'LSU',
        'Mike Evans': 'Texas A&M',
        
        // TEs
        'Travis Kelce': 'Cincinnati',
        'George Kittle': 'Iowa',
        'Rob Gronkowski': 'Arizona',
        'Mark Andrews': 'Oklahoma',
        'Darren Waller': 'Georgia Tech',
        'Kyle Pitts': 'Florida',
        'T.J. Hockenson': 'Iowa',
        'Dalton Kincaid': 'Utah',
        'Pat Freiermuth': 'Penn State',
        'Evan Engram': 'Ole Miss',
        'Zach Ertz': 'Stanford',
        'Tyler Higbee': 'Western Kentucky',
        'Hunter Henry': 'Arkansas',
        'Dallas Goedert': 'South Dakota State',
        'Noah Fant': 'Iowa',
        'Jimmy Graham': 'Miami',
        'Antonio Gates': 'Kent State',
        'Jason Witten': 'Tennessee',
        'Greg Olsen': 'Miami',
        'Jared Cook': 'South Carolina',
        'Tony Gonzalez': 'California',
        'Shannon Sharpe': 'Savannah State',
        'Kellen Winslow': 'Miami',
        'Ozzie Newsome': 'Alabama',
        'Mike Ditka': 'Pitt',
        'Dave Casper': 'Notre Dame',
        'John Mackey': 'Syracuse',
        'Charlie Sanders': 'Minnesota',
        'Jackie Smith': 'Northwestern State',
        'Raymond Chester': 'Morgan State',
        'Vernon Davis': 'Maryland',
        'Brent Celek': 'Cincinnati',
        'Heath Miller': 'Virginia',
        'Dallas Clark': 'Iowa',
        'Todd Heap': 'Arizona State',
        'Jeremy Shockey': 'Miami',
        'Alge Crumpler': 'North Carolina',
        'Chris Cooley': 'Utah State',
        
        // Defense
        'Lawrence Taylor': 'North Carolina',
        'Reggie White': 'Tennessee',
        'Bruce Smith': 'Virginia Tech',
        'Deion Sanders': 'Florida State',
        'Ronnie Lott': 'USC',
        'Dick Butkus': 'Illinois',
        'Ray Lewis': 'Miami',
        'Brian Urlacher': 'New Mexico',
        'Junior Seau': 'USC',
        'Derrick Thomas': 'Alabama',
        'Michael Strahan': 'Texas Southern',
        'Warren Sapp': 'Miami',
        'John Randle': 'Texas A&M',
        'Cortez Kennedy': 'Miami',
        'Simeon Rice': 'Illinois',
        'Champ Bailey': 'Georgia',
        'Charles Woodson': 'Michigan',
        'Darren Woodson': 'Arizona State',
        'Rod Woodson': 'Purdue',
        'J.J. Watt': 'Wisconsin',
        'Aaron Donald': 'Pitt',
        'Khalil Mack': 'Buffalo',
        'Von Miller': 'Texas A&M',
        'T.J. Watt': 'Wisconsin',
        'Myles Garrett': 'Texas A&M',
        'Nick Bosa': 'Ohio State',
        'Joey Bosa': 'Ohio State',
        'Chandler Jones': 'Syracuse',
        'Luke Kuechly': 'Boston College',
        'Bobby Wagner': 'Utah State',
        'Micah Parsons': 'Penn State',
        'Darius Leonard': 'South Carolina State',
        'Fred Warner': 'BYU',
        'Roquan Smith': 'Georgia',
        'Devin White': 'LSU',
        'Trevon Diggs': 'Alabama',
        'Jalen Ramsey': 'Florida State',
        'Stefon Gilmore': 'South Carolina',
        'Xavien Howard': 'Baylor',
        'Jaire Alexander': 'Louisville',
        'Derwin James': 'Florida State',
        'Minkah Fitzpatrick': 'Alabama',
        'Tyrann Mathieu': 'LSU',
        'Harrison Smith': 'Notre Dame',
        'Jamal Adams': 'LSU',
        'Ed Reed': 'Miami',
        'Troy Polamalu': 'USC',
        'Richard Sherman': 'Stanford',
        'Sauce Gardner': 'Cincinnati',
        'Pat Surtain II': 'Alabama',
        'Denzel Ward': 'Ohio State',
        'Marshon Lattimore': 'Ohio State',
        'Darius Slay': 'Mississippi State',
        'Marlon Humphrey': 'Alabama',
        'Marcus Peters': 'Washington',
        'A.J. Terrell': 'Clemson',
        'Tariq Woolen': 'UTSA',
        'Trent McDuffie': 'Washington',
        'Kaiir Elam': 'Florida',
        'Derek Stingley Jr.': 'LSU',
        'Ahmad Gardner': 'Cincinnati',
        'DeMarcus Lawrence': 'Boise State',
        
        // Special Teams
        'Devin Hester': 'Miami',
        'Darren Sproles': 'Kansas State',
        'Cordarrelle Patterson': 'Tennessee',
        'Jakeem Grant': 'Texas Tech',
        'Dante Hall': 'Texas A&M',
        'Josh Cribbs': 'Kent State',
        'Andre Roberts': 'Citadel',
        'Tarik Cohen': 'North Carolina A&T',
        'Nyheim Hines': 'NC State',
        
        // Current Players (2020-2024)
        'C.J. Stroud': 'Ohio State',
        'Anthony Richardson': 'Florida',
        'Bryce Young': 'Alabama',
        'Brock Purdy': 'Iowa State',
        'Breece Hall': 'Iowa State',
        'Bijan Robinson': 'Texas',
        'Jahmyr Gibbs': 'Alabama',
        'Kenneth Walker III': 'Michigan State',
        'Rachaad White': 'Arizona State',
        'Isiah Pacheco': 'Rutgers',
        'Rhamondre Stevenson': 'Oklahoma',
        'Travis Etienne': 'Clemson',
        'Dameon Pierce': 'Florida',
        'J.K. Dobbins': 'Ohio State',
        'Cam Akers': 'Florida State',
        'D\'Andre Swift': 'Georgia',
        'Javonte Williams': 'North Carolina',
        'Najee Harris': 'Alabama',
        'Antonio Gibson': 'Memphis',
        'Puka Nacua': 'BYU',
        'Tank Dell': 'Houston',
        'Zay Flowers': 'Boston College',
        'Jordan Addison': 'USC',
        'Jaxon Smith-Njigba': 'Ohio State',
        'Quentin Johnston': 'TCU',
        'Marvin Mims': 'Oklahoma',
        'Josh Downs': 'North Carolina',
        'Jayden Reed': 'Michigan State',
        'Rashee Rice': 'SMU',
        'Sam LaPorta': 'Iowa',
        'Jake Ferguson': 'Wisconsin',
        'Tucker Kraft': 'South Dakota State',
        'Luke Musgrave': 'Oregon State',
        'Michael Mayer': 'Notre Dame',
        'Brenton Strange': 'Penn State',
        'Darnell Washington': 'Georgia',
        'Luke Schoonmaker': 'Michigan',
        'Cade Otton': 'Washington',
        'Isaiah Likely': 'Coastal Carolina',
        'Trey McBride': 'Colorado State',
        'Cole Kmet': 'Notre Dame',
        'David Njoku': 'Miami',
        'Gerald Everett': 'South Alabama',
        'Tyler Conklin': 'Central Michigan',
        'Hayden Hurst': 'South Carolina',
        'Mike Gesicki': 'Penn State',
        'Austin Hooper': 'Stanford',
        'Jonnu Smith': 'Florida International',
        'Logan Thomas': 'Virginia Tech',
        'Mo Alie-Cox': 'VCU',
        'Foster Moreau': 'LSU',
        'Harrison Bryant': 'Florida Atlantic',
        'Adam Trautman': 'Dayton',
        'Drew Sample': 'Washington',
        'Kylen Granson': 'SMU',
        'Chris Jones': 'Mississippi State',
        'Quinnen Williams': 'Alabama',
        'Jeffery Simmons': 'Mississippi State',
        'Dexter Lawrence': 'Clemson',
        'Vita Vea': 'Washington',
        'Derrick Brown': 'Auburn',
        'Javon Kinlaw': 'South Carolina',
        'Rashan Gary': 'Michigan',
        'Montez Sweat': 'Mississippi State',
        'Josh Allen': 'Kentucky',
        'Brian Burns': 'Florida State',
        'Maxx Crosby': 'Eastern Michigan',
        'Trey Hendrickson': 'Florida Atlantic',
        'Danielle Hunter': 'LSU',
        'Cameron Jordan': 'California',
        'Calais Campbell': 'Miami',
        'Fletcher Cox': 'Mississippi State',
        'Grady Jarrett': 'Clemson',
        'Kenny Clark': 'UCLA',
        'Arik Armstead': 'Oregon',
        'DeForest Buckner': 'Oregon',
        'Jalen Carter': 'Georgia',
        'Will Anderson Jr.': 'Alabama',
        'Tyree Wilson': 'Texas Tech',
        'Lukas Van Ness': 'Iowa',
        'Felix Anudike-Uzomah': 'Kansas State',
        'Myles Murphy': 'Clemson',
        'Keion White': 'Georgia Tech',
        'Adetomiwa Adebawore': 'Northwestern',
        'Bryan Bresee': 'Clemson',
        'Mazi Smith': 'Michigan',
        'Keeanu Benton': 'Wisconsin',
        'Gervon Dexter': 'Florida',
        'Zach Harrison': 'Ohio State',
        'Tuli Tuipulotu': 'USC',
        'Byron Young': 'Tennessee',
        'Derick Hall': 'Auburn',
        'Isaiah Foskey': 'Notre Dame',
        'Will McDonald IV': 'Iowa State',
        'BJ Ojulari': 'LSU',
        'Tyler Lacy': 'Oklahoma State',
        'Colby Wooden': 'Auburn',
        'Zach Pickens': 'South Carolina',
        'Kobie Turner': 'Wake Forest',
        'Cameron Young': 'Mississippi State',
        'Jaquelin Roy': 'LSU',
        'Keondre Coburn': 'Texas',
        'Dante Stills': 'West Virginia',
        'Karl Brooks': 'Bowling Green',
        'Zachary Carter': 'Florida',
        'Jalen Redmond': 'Oklahoma',
        'Cory Trice Jr.': 'Purdue',
        'Emmanuel Forbes': 'Mississippi State',
        'Devon Witherspoon': 'Illinois',
        'Christian Gonzalez': 'Oregon',
        'Joey Porter Jr.': 'Penn State',
        'Deonte Banks': 'Maryland',
        'Cam Smith': 'South Carolina',
        'Kelee Ringo': 'Georgia',
        'Tyrique Stevenson': 'Miami',
        'Julius Brents': 'Kansas State',
        'Darius Rush': 'South Carolina',
        'Riley Moss': 'Iowa',
        'Terell Smith': 'Minnesota',
        'Jakorian Bennett': 'Maryland',
        'Kyu Blu Kelly': 'Stanford',
        'Rejzohn Wright': 'Oregon State',
        'Alex Austin': 'Oregon State',
        'Carrington Valentine': 'Kentucky',
        'Jartavius Martin': 'Illinois',
        
        // 2024 Rookies and Newer Players
        'Caleb Williams': 'USC',
        'Jayden Daniels': 'LSU', 
        'Drake Maye': 'North Carolina',
        'Bo Nix': 'Oregon',
        'Michael Penix Jr.': 'Washington',
        'J.J. McCarthy': 'Michigan',
        'Spencer Rattler': 'South Carolina',
        'Malik Willis': 'Liberty',
        'Desmond Ridder': 'Cincinnati',
        'Hendon Hooker': 'Tennessee',
        'Carson Strong': 'Nevada',
        'Bailey Zappe': 'Western Kentucky',
        'Skylar Thompson': 'Kansas State',
        'Sam Howell': 'North Carolina',
        'Tanner McKee': 'Stanford',
        'Clayton Tune': 'Houston',
        'Dorian Thompson-Robinson': 'UCLA',
        'Jaren Hall': 'BYU',
        'Stetson Bennett': 'Georgia',
        'Jake Haener': 'Fresno State'
    };
    
    return playerColleges[playerName] || 'Unknown College';
}

function generateJerseyNumber(position, playerName) {
    // Try API data first for modern players
    if (apiPlayerData.has(playerName)) {
        const apiData = apiPlayerData.get(playerName);
        if (apiData.jersey && apiData.jersey !== null && apiData.jersey !== undefined) {
            return apiData.jersey.toString();
        }
    }
    
    // Fallback to hardcoded data
    // Real jersey numbers for specific players
    const playerJerseys = {
        // QBs
        'Tom Brady': '12',
        'Aaron Rodgers': '8',
        'Patrick Mahomes': '15',
        'Josh Allen': '17',
        'Lamar Jackson': '8',
        'Joe Burrow': '9',
        'Dak Prescott': '4',
        'Justin Herbert': '10',
        'Peyton Manning': '18',
        'Drew Brees': '9',
        'Brett Favre': '4',
        'Eli Manning': '10',
        'Ben Roethlisberger': '7',
        'Russell Wilson': '3',
        'Matt Ryan': '2',
        'Philip Rivers': '17',
        'Matthew Stafford': '9',
        'Kirk Cousins': '8',
        'Cam Newton': '1',
        'Andrew Luck': '12',
        'Jalen Hurts': '1',
        'Tua Tagovailoa': '1',
        'Trevor Lawrence': '16',
        
        // RBs
        'Derrick Henry': '22',
        'Saquon Barkley': '26',
        'Ezekiel Elliott': '21',
        'Christian McCaffrey': '23',
        'Alvin Kamara': '41',
        'Nick Chubb': '24',
        'Dalvin Cook': '33',
        'Aaron Jones': '33',
        'Josh Jacobs': '28',
        'Jonathan Taylor': '28',
        'Austin Ekeler': '30',
        'Leonard Fournette': '7',
        'Joe Mixon': '28',
        'Miles Sanders': '26',
        'Tony Pollard': '20',
        'Todd Gurley': '30',
        'Le\'Veon Bell': '26',
        'David Johnson': '31',
        'Kareem Hunt': '27',
        'James Conner': '30',
        'Melvin Gordon': '25',
        'Mark Ingram': '22',
        'LeSean McCoy': '25',
        'Marshaun Lynch': '24',
        'Adrian Peterson': '28',
        'Frank Gore': '21',
        'Arian Foster': '23',
        'Jamaal Charles': '25',
        'LaDainian Tomlinson': '21',
        'Shaun Alexander': '37',
        'Priest Holmes': '31',
        'Clinton Portis': '26',
        'Edgerrin James': '32',
        'Marshall Faulk': '28',
        'Ricky Williams': '34',
        'Jamal Lewis': '31',
        'Corey Dillon': '28',
        'Warrick Dunn': '28',
        'Tony Dorsett': '33',
        'Marcus Allen': '32',
        'Thurman Thomas': '34',
        'Jerome Bettis': '36',
        'Curtis Martin': '28',
        'Barry Sanders': '20',
        'Emmitt Smith': '22',
        'Walter Payton': '34',
        'Jim Brown': '32',
        'Eric Dickerson': '29',
        
        // WRs
        'Davante Adams': '17',
        'Tyreek Hill': '10',
        'Stefon Diggs': '14',
        'Cooper Kupp': '10',
        'Justin Jefferson': '18',
        'Ja\'Marr Chase': '1',
        'CeeDee Lamb': '88',
        'DK Metcalf': '14',
        'A.J. Brown': '11',
        'Terry McLaurin': '17',
        'D.J. Moore': '2',
        'Chris Godwin': '14',
        'Mike Williams': '81',
        'Brandin Cooks': '13',
        'Tyler Lockett': '16',
        'Robert Woods': '17',
        'Allen Robinson': '12',
        'Adam Thielen': '19',
        'Jarvis Landry': '80',
        'Julian Edelman': '11',
        'Emmanuel Sanders': '10',
        'Deebo Samuel': '19',
        'Amon-Ra St. Brown': '14',
        'Jaylen Waddle': '17',
        'Garrett Wilson': '17',
        'Drake London': '5',
        'Chris Olave': '12',
        'Tee Higgins': '85',
        'Marquise Brown': '11',
        'Courtland Sutton': '14',
        'Dionte Johnson': '18',
        'Larry Fitzgerald': '11',
        'Anquan Boldin': '81',
        'Reggie Wayne': '87',
        'Chad Johnson': '85',
        'Santana Moss': '89',
        'Plaxico Burress': '17',
        'Wes Welker': '83',
        'Victor Cruz': '80',
        'Hakeem Nicks': '88',
        'DeSean Jackson': '10',
        'Jeremy Maclin': '18',
        'Torrey Smith': '82',
        'Cris Carter': '80',
        'Marvin Harrison': '88',
        'Tim Brown': '81',
        'Isaac Bruce': '80',
        'Torry Holt': '81',
        'Hines Ward': '86',
        'Roddy White': '84',
        'Steve Smith Sr.': '89',
        'Mario Manningham': '82',
        'David Tyree': '85',
        'Tyler Boyd': '83',
        'Marvin Jones': '11',
        'Kenny Golladay': '19',
        'Allen Lazard': '13',
        'Russell Gage': '83',
        'Kendrick Bourne': '84',
        'Jakobi Meyers': '16',
        'Hunter Renfrow': '13',
        'Cole Beasley': '11',
        'Golden Tate': '15',
        'Amari Cooper': '19',
        'Michael Thomas': '13',
        'Keenan Allen': '13',
        'DeAndre Hopkins': '10',
        'Antonio Brown': '81',
        'Odell Beckham Jr.': '3',
        'Mike Evans': '13',
        
        // TEs
        'Travis Kelce': '87',
        'George Kittle': '85',
        'Rob Gronkowski': '87',
        'Mark Andrews': '89',
        'Darren Waller': '83',
        'Kyle Pitts': '8',
        'T.J. Hockenson': '88',
        'Dalton Kincaid': '86',
        'Pat Freiermuth': '88',
        'Evan Engram': '17',
        'Zach Ertz': '86',
        'Tyler Higbee': '89',
        'Hunter Henry': '85',
        'Dallas Goedert': '88',
        'Noah Fant': '87',
        'Jimmy Graham': '80',
        'Antonio Gates': '85',
        'Jason Witten': '82',
        'Greg Olsen': '88',
        'Jared Cook': '87',
        'Tony Gonzalez': '88',
        'Shannon Sharpe': '84',
        'Kellen Winslow': '80',
        'Ozzie Newsome': '82',
        'Mike Ditka': '89',
        'Dave Casper': '87',
        'John Mackey': '88',
        'Charlie Sanders': '88',
        'Jackie Smith': '81',
        'Raymond Chester': '87',
        'Vernon Davis': '85',
        'Brent Celek': '87',
        'Heath Miller': '83',
        'Dallas Clark': '87',
        'Todd Heap': '86',
        'Jeremy Shockey': '80',
        'Alge Crumpler': '83',
        'Chris Cooley': '47',
        
        // Defense
        'Lawrence Taylor': '56',
        'Reggie White': '92',
        'Bruce Smith': '78',
        'Deion Sanders': '21',
        'Ronnie Lott': '42',
        'Dick Butkus': '51',
        'Ray Lewis': '52',
        'Brian Urlacher': '54',
        'Junior Seau': '55',
        'Derrick Thomas': '58',
        'Michael Strahan': '92',
        'Warren Sapp': '99',
        'John Randle': '93',
        'Cortez Kennedy': '96',
        'Simeon Rice': '97',
        'Champ Bailey': '24',
        'Charles Woodson': '24',
        'Darren Woodson': '28',
        'Rod Woodson': '26',
        'J.J. Watt': '99',
        'Aaron Donald': '99',
        'Khalil Mack': '52',
        'Von Miller': '58',
        'T.J. Watt': '90',
        'Myles Garrett': '95',
        'Nick Bosa': '97',
        'Joey Bosa': '99',
        'Chandler Jones': '55',
        'Luke Kuechly': '59',
        'Bobby Wagner': '54',
        'Micah Parsons': '11',
        'Darius Leonard': '53',
        'Fred Warner': '54',
        'Roquan Smith': '58',
        'Devin White': '45',
        'Trevon Diggs': '7',
        'Jalen Ramsey': '5',
        'Stefon Gilmore': '24',
        'Xavien Howard': '25',
        'Jaire Alexander': '23',
        'Derwin James': '33',
        'Minkah Fitzpatrick': '39',
        'Tyrann Mathieu': '32',
        'Harrison Smith': '22',
        'Jamal Adams': '33',
        'Ed Reed': '20',
        'Troy Polamalu': '43',
        'Richard Sherman': '25',
        'Sauce Gardner': '1',
        'Pat Surtain II': '2',
        'Denzel Ward': '21',
        'Marshon Lattimore': '23',
        'Darius Slay': '23',
        'Marlon Humphrey': '44',
        'Marcus Peters': '22',
        'A.J. Terrell': '24',
        'Tariq Woolen': '27',
        'Trent McDuffie': '22',
        'Kaiir Elam': '24',
        'Derek Stingley Jr.': '24',
        'Ahmad Gardner': '1',
        'DeMarcus Lawrence': '90',
        
        // Special Teams
        'Devin Hester': '23',
        'Darren Sproles': '43',
        'Cordarrelle Patterson': '84',
        'Jakeem Grant': '19',
        'Dante Hall': '82',
        'Josh Cribbs': '16',
        'Andre Roberts': '12',
        'Tarik Cohen': '29',
        'Nyheim Hines': '20',
        
        // Current Players (2020-2024)
        'C.J. Stroud': '7',
        'Anthony Richardson': '5',
        'Bryce Young': '9',
        'Brock Purdy': '13',
        'Breece Hall': '20',
        'Bijan Robinson': '7',
        'Jahmyr Gibbs': '26',
        'Kenneth Walker III': '9',
        'Rachaad White': '1',
        'Isiah Pacheco': '10',
        'Rhamondre Stevenson': '38',
        'Travis Etienne': '1',
        'Dameon Pierce': '31',
        'J.K. Dobbins': '27',
        'Cam Akers': '3',
        'D\'Andre Swift': '0',
        'Javonte Williams': '33',
        'Najee Harris': '22',
        'Antonio Gibson': '24',
        'Puka Nacua': '17',
        'Tank Dell': '3',
        'Zay Flowers': '4',
        'Jordan Addison': '3',
        'Jaxon Smith-Njigba': '11',
        'Quentin Johnston': '1',
        'Marvin Mims': '19',
        'Josh Downs': '1',
        'Jayden Reed': '11',
        'Rashee Rice': '4',
        'Sam LaPorta': '87',
        'Jake Ferguson': '87',
        'Tucker Kraft': '85',
        'Luke Musgrave': '88',
        'Michael Mayer': '87',
        'Brenton Strange': '87',
        'Darnell Washington': '80',
        'Luke Schoonmaker': '86',
        'Cade Otton': '88',
        'Isaiah Likely': '80',
        'Trey McBride': '85',
        'Cole Kmet': '85',
        'David Njoku': '85',
        'Gerald Everett': '81',
        'Tyler Conklin': '83',
        'Hayden Hurst': '81',
        'Mike Gesicki': '88',
        'Austin Hooper': '81',
        'Jonnu Smith': '81',
        'Logan Thomas': '82',
        'Mo Alie-Cox': '81',
        'Foster Moreau': '87',
        'Harrison Bryant': '88',
        'Adam Trautman': '82',
        'Drew Sample': '89',
        'Kylen Granson': '83',
        'Chris Jones': '95',
        'Quinnen Williams': '95',
        'Jeffery Simmons': '98',
        'Dexter Lawrence': '97',
        'Vita Vea': '50',
        'Derrick Brown': '95',
        'Javon Kinlaw': '99',
        'Rashan Gary': '52',
        'Montez Sweat': '9',
        'Josh Allen': '41',
        'Brian Burns': '0',
        'Maxx Crosby': '98',
        'Trey Hendrickson': '91',
        'Danielle Hunter': '99',
        'Cameron Jordan': '94',
        'Calais Campbell': '93',
        'Fletcher Cox': '91',
        'Grady Jarrett': '97',
        'Kenny Clark': '97',
        'Arik Armstead': '91',
        'DeForest Buckner': '99',
        'Jalen Carter': '98',
        'Will Anderson Jr.': '51',
        'Tyree Wilson': '9',
        'Lukas Van Ness': '90',
        'Felix Anudike-Uzomah': '56',
        'Myles Murphy': '99',
        'Keion White': '99',
        'Adetomiwa Adebawore': '93',
        'Bryan Bresee': '90',
        'Mazi Smith': '58',
        'Keeanu Benton': '95',
        'Gervon Dexter': '95',
        'Zach Harrison': '90',
        'Tuli Tuipulotu': '45',
        'Byron Young': '91',
        'Derick Hall': '29',
        'Isaiah Foskey': '56',
        'Will McDonald IV': '99',
        'BJ Ojulari': '18',
        'Tyler Lacy': '95',
        'Colby Wooden': '90',
        'Zach Pickens': '96',
        'Kobie Turner': '91',
        'Cameron Young': '90',
        'Jaquelin Roy': '90',
        'Keondre Coburn': '95',
        'Dante Stills': '95',
        'Karl Brooks': '96',
        'Zachary Carter': '95',
        'Jalen Redmond': '95',
        'Cory Trice Jr.': '29',
        'Emmanuel Forbes': '13',
        'Devon Witherspoon': '21',
        'Christian Gonzalez': '6',
        'Joey Porter Jr.': '24',
        'Deonte Banks': '27',
        'Cam Smith': '24',
        'Kelee Ringo': '22',
        'Tyrique Stevenson': '29',
        'Julius Brents': '29',
        'Darius Rush': '29',
        'Riley Moss': '29',
        'Terell Smith': '29',
        'Jakorian Bennett': '29',
        'Kyu Blu Kelly': '29',
        'Rejzohn Wright': '29',
        'Alex Austin': '29',
        'Carrington Valentine': '29',
        'Jartavius Martin': '29',
        
        // 2024 Rookies and Newer Players
        'Caleb Williams': '18',
        'Jayden Daniels': '5', 
        'Drake Maye': '10',
        'Bo Nix': '10',
        'Michael Penix Jr.': '9',
        'J.J. McCarthy': '9',
        'Spencer Rattler': '7',
        'Malik Willis': '7',
        'Desmond Ridder': '4',
        'Hendon Hooker': '12',
        'Carson Strong': '17',
        'Bailey Zappe': '4',
        'Skylar Thompson': '19',
        'Sam Howell': '3',
        'Tanner McKee': '19',
        'Clayton Tune': '15',
        'Dorian Thompson-Robinson': '17',
        'Jaren Hall': '16',
        'Stetson Bennett': '13',
        'Jake Haener': '4'
    };
    
    // Return real jersey number if available, otherwise generate based on position
    if (playerJerseys[playerName]) {
        return playerJerseys[playerName];
    }
    
    const positionRanges = {
        'QB': [1, 19],
        'RB': [20, 49],
        'WR': [10, 19, 80, 89],
        'TE': [80, 89],
        'K': [1, 19],
        'P': [1, 19],
        'LS': [40, 59],
        'DL': [50, 79, 90, 99],
        'LB': [40, 59, 90, 99],
        'DB': [20, 49]
    };
    
    const ranges = positionRanges[position] || [1, 99];
    if (ranges.length === 2) {
        return Math.floor(Math.random() * (ranges[1] - ranges[0] + 1)) + ranges[0];
    } else {
        const range = ranges[Math.floor(Math.random() * (ranges.length / 2)) * 2];
        return Math.floor(Math.random() * (ranges[range + 1] - ranges[range] + 1)) + ranges[range];
    }
}

function calculateGeneratedPopularity(playerName, position, era) {
    const superstars = ['Tom Brady', 'Aaron Rodgers', 'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Jerry Rice', 'Barry Sanders', 'Emmitt Smith', 'Walter Payton', 'Jim Brown', 'Joe Montana', 'John Elway', 'Dan Marino', 'Steve Young', 'Troy Aikman'];
    
    if (superstars.includes(playerName)) return 5;
    if (position === 'QB') return 4;
    if (['RB', 'WR', 'TE'].includes(position)) return 3;
    if (['LB', 'DE', 'CB', 'S'].includes(position)) return 2;
    return 1;
}

function generatePlayerFacts(playerName, position, team, college) {
    const facts = [];
    
    if (position === 'QB') {
        facts.push(`Quarterback for ${team}`);
        facts.push(`Attended ${college}`);
        facts.push(`Wears jersey number ${generateJerseyNumber(position, playerName)}`);
    } else if (position === 'RB') {
        facts.push(`Running back for ${team}`);
        facts.push(`Attended ${college}`);
        facts.push(`Wears jersey number ${generateJerseyNumber(position, playerName)}`);
    } else if (position === 'WR') {
        facts.push(`Wide receiver for ${team}`);
        facts.push(`Attended ${college}`);
        facts.push(`Wears jersey number ${generateJerseyNumber(position, playerName)}`);
    } else if (position === 'TE') {
        facts.push(`Tight end for ${team}`);
        facts.push(`Attended ${college}`);
        facts.push(`Wears jersey number ${generateJerseyNumber(position, playerName)}`);
    }
    
    if (playerName.includes(' ')) {
        const nameParts = playerName.split(' ');
        facts.push(`Full name: ${playerName}`);
    }
    
    return facts.length > 0 ? facts : ['Professional NFL player'];
}

function generatePlayerToFactQuestion(player) {
    const fact = player.facts[Math.floor(Math.random() * player.facts.length)];
    const wrongAnswers = generateWrongAnswers(fact, player);
    
    return {
        type: 'player-to-fact',
        player: player,
        question: `What is a fact about ${player.name}?`,
        correctAnswer: fact,
        options: shuffleArray([fact, ...wrongAnswers]),
        isJersey: false
    };
}

function generateCollegeQuestion(player) {
    const allPlayers = getPlayersForSport();
    const wrongColleges = [];
    
    // Generate wrong colleges from other players, excluding the correct answer
    allPlayers.forEach(p => {
        if (p.name !== player.name && p.college && p.college !== player.college && !wrongColleges.includes(p.college)) {
            wrongColleges.push(p.college);
        }
    });
    
    // Shuffle and take 3 wrong answers
    const selectedWrong = shuffleArray(wrongColleges).slice(0, 3);
    
    // Ensure we have enough unique options
    const allOptions = [player.college, ...selectedWrong];
    const uniqueOptions = [...new Set(allOptions)]; // Remove duplicates
    
    // If we don't have enough unique options, add some generic colleges
    while (uniqueOptions.length < 4) {
        const genericColleges = ['Alabama', 'Ohio State', 'Michigan', 'Georgia', 'Clemson', 'Notre Dame', 'USC', 'Texas', 'Florida', 'Penn State'];
        const randomCollege = genericColleges[Math.floor(Math.random() * genericColleges.length)];
        if (!uniqueOptions.includes(randomCollege)) {
            uniqueOptions.push(randomCollege);
        }
    }
    
    return {
        type: 'college-guesser',
        player: player,
        question: `What college did ${player.name} attend?`,
        correctAnswer: player.college,
        options: shuffleArray(uniqueOptions.slice(0, 4)), // Ensure exactly 4 unique options
        isCollege: true
    };
}

function generateJerseyQuestion(player) {
    const allPlayers = getPlayersForSport();
    const wrongJerseys = [];
    
    // Generate wrong jersey numbers from other players, excluding the correct answer
    allPlayers.forEach(p => {
        if (p.name !== player.name && p.jerseyNumber !== player.jerseyNumber && !wrongJerseys.includes(p.jerseyNumber)) {
            wrongJerseys.push(p.jerseyNumber);
        }
    });
    
    // Shuffle and take 3 wrong answers
    const selectedWrong = shuffleArray(wrongJerseys).slice(0, 3);
    
    // Ensure we have enough unique options
    const allOptions = [player.jerseyNumber, ...selectedWrong];
    const uniqueOptions = [...new Set(allOptions)]; // Remove duplicates
    
    // If we don't have enough unique options, add some common jersey numbers
    while (uniqueOptions.length < 4) {
        const commonJerseys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
        const randomJersey = commonJerseys[Math.floor(Math.random() * commonJerseys.length)];
        if (!uniqueOptions.includes(randomJersey)) {
            uniqueOptions.push(randomJersey);
        }
    }
    
    return {
        type: 'jersey-guesser',
        player: player,
        question: `What jersey number does ${player.name} wear?`,
        correctAnswer: player.jerseyNumber,
        options: shuffleArray(uniqueOptions.slice(0, 4)), // Ensure exactly 4 unique options
        isJersey: true
    };
}

function generateAchievementQuestion(player1, player2) {
    const achievementTypes = ['pro-bowls', 'super-bowls', 'mvps'];
    const achievementType = achievementTypes[Math.floor(Math.random() * achievementTypes.length)];
    
    // Generate mock achievement data based on player popularity and position
    const player1Achievements = generatePlayerAchievements(player1);
    const player2Achievements = generatePlayerAchievements(player2);
    
    let question, correctAnswer, player1Value, player2Value;
    
    switch (achievementType) {
        case 'pro-bowls':
            player1Value = player1Achievements.proBowls;
            player2Value = player2Achievements.proBowls;
            question = `Who has more Pro Bowl selections?`;
            correctAnswer = player1Value > player2Value ? player1.name : player2.name;
            break;
        case 'super-bowls':
            player1Value = player1Achievements.superBowls;
            player2Value = player2Achievements.superBowls;
            question = `Who has more Super Bowl wins?`;
            correctAnswer = player1Value > player2Value ? player1.name : player2.name;
            break;
        case 'mvps':
            player1Value = player1Achievements.mvps;
            player2Value = player2Achievements.mvps;
            question = `Who has more MVP awards?`;
            correctAnswer = player1Value > player2Value ? player1.name : player2.name;
            break;
    }
    
    return {
        type: 'achievement-guesser',
        player1: player1,
        player2: player2,
        question: question,
        correctAnswer: correctAnswer,
        options: shuffleArray([player1.name, player2.name]),
        achievementType: achievementType,
        player1Value: player1Value,
        player2Value: player2Value,
        player1Achievements: player1Achievements,
        player2Achievements: player2Achievements
    };
}

// Generate mock achievement data based on player characteristics
function generatePlayerAchievements(player) {
    const achievements = {
        proBowls: 0,
        superBowls: 0,
        mvps: 0
    };
    
    // Base achievements on position and popularity
    if (player.position === 'QB') {
        achievements.proBowls = Math.floor(Math.random() * 8) + 2; // 2-9 Pro Bowls
        achievements.superBowls = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0; // 30% chance of Super Bowls
        achievements.mvps = Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0; // 20% chance of MVPs
    } else if (['RB', 'WR', 'TE'].includes(player.position)) {
        achievements.proBowls = Math.floor(Math.random() * 6) + 1; // 1-6 Pro Bowls
        achievements.superBowls = Math.random() < 0.2 ? Math.floor(Math.random() * 2) + 1 : 0; // 20% chance
        achievements.mvps = Math.random() < 0.1 ? 1 : 0; // 10% chance
    } else if (['LB', 'DE', 'CB', 'S'].includes(player.position)) {
        achievements.proBowls = Math.floor(Math.random() * 5) + 1; // 1-5 Pro Bowls
        achievements.superBowls = Math.random() < 0.15 ? Math.floor(Math.random() * 2) + 1 : 0; // 15% chance
        achievements.mvps = Math.random() < 0.05 ? 1 : 0; // 5% chance
    } else {
        achievements.proBowls = Math.floor(Math.random() * 2) + 1; // 1-2 Pro Bowls
        achievements.superBowls = Math.random() < 0.05 ? 1 : 0; // 5% chance
        achievements.mvps = 0; // Very rare for specialists
    }
    
    // Adjust based on popularity (higher popularity = more achievements)
    if (player.popularity >= 4) {
        achievements.proBowls += Math.floor(Math.random() * 3);
        achievements.superBowls += Math.random() < 0.3 ? 1 : 0;
        achievements.mvps += Math.random() < 0.2 ? 1 : 0;
    }
    
    return achievements;
}

function generateWrongAnswers(correctFact, correctPlayer) {
    const allPlayers = getPlayersForSport();
    const wrongAnswers = [];
    
    allPlayers.forEach(player => {
        if (player.name !== correctPlayer.name) {
            player.facts.forEach(fact => {
                if (!wrongAnswers.includes(fact)) {
                    wrongAnswers.push(fact);
                }
            });
        }
    });
    
    return shuffleArray(wrongAnswers).slice(0, 3);
}

// Difficulty function removed - using single well-known players dataset

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Game Flow
function startQuestion() {
    const question = currentGame.questions[currentGame.currentQuestion];
    
    if (!question) {
        endGame();
        return;
    }
    
    updateQuestionUI(question);
    
    if (currentGame.mode !== 'free-play') {
        currentGame.timeLeft = 10;
        startTimer();
    }
}

function updateQuestionUI(question) {
    // Update progress and question display based on game mode
    if (currentGame.mode === 'survival') {
        // For survival mode, show current streak instead of progress
        document.querySelector('.progress-fill').style.width = '100%'; // Always full for survival
        document.querySelector('.question-number').textContent = `Survival Streak: ${currentGame.streak}`;
    } else {
        // Regular mode - show progress and question count
        const progress = ((currentGame.currentQuestion + 1) / currentGame.questionCount) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.question-number').textContent = 
            `Question ${currentGame.currentQuestion + 1} of ${currentGame.questionCount}`;
    }
    
    // Show player info or hide player card for trivia
    const playerCard = document.getElementById('player-card');
    if (question.type === 'trivia') {
        // Hide player card for trivia questions
        playerCard.style.display = 'none';
    } else {
        // Show player card for player-based questions
        playerCard.style.display = 'block';
        document.getElementById('player-name').textContent = question.player.name;
        document.getElementById('player-team').textContent = question.player.team;
    }
    
    // Set question text
    document.getElementById('question-text').innerHTML = `<h2>${question.question}</h2>`;
    
    // Set answer options
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    
    // Show different input types based on game mode
    if (currentGame.inputMode === 'text-input') {
        // Show text input
        document.getElementById('text-input-container').style.display = 'block';
        document.getElementById('answer-options').style.display = 'none';
        
        // Focus on the text input and add Enter key support
        setTimeout(() => {
            const textInput = document.getElementById('text-answer-input');
            textInput.focus();
            
            // Add Enter key listener
            textInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    submitTextAnswer();
                }
            };
        }, 100);
    } else {
        // Show multiple choice
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.onclick = () => selectAnswer(index);
            answerOptions.appendChild(button);
        });
        
        document.getElementById('text-input-container').style.display = 'none';
        document.getElementById('answer-options').style.display = 'grid';
    }
}

function showPlayerToFactQuestion(question) {
    // Show player info
    document.getElementById('player-name').textContent = question.player.name;
    document.getElementById('player-team').textContent = question.player.team;
    
    // Set question
    document.getElementById('question-text').innerHTML = `<h2>${question.question}</h2>`;
    
    // Set answer options
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        answerOptions.appendChild(btn);
    });
}

function showCollegeQuestion(question) {
    // Show player info
    document.getElementById('player-name').textContent = question.player.name;
    document.getElementById('player-team').textContent = question.player.team;
    
    // Set question
    document.getElementById('question-text').innerHTML = `<h2>What college did ${question.player.name} attend?</h2>`;
    
    // Set answer options
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        answerOptions.appendChild(btn);
    });
}

function showJerseyQuestion(question) {
    // Show player info
    document.getElementById('player-name').textContent = question.player.name;
    document.getElementById('player-team').textContent = question.player.team;
    
    // Set question
    document.getElementById('question-text').innerHTML = `<h2>What jersey number does ${question.player.name} wear?</h2>`;
    
    // Set answer options
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        answerOptions.appendChild(btn);
    });
}

function showAchievementQuestion(question) {
    // Hide player info for achievement questions
    document.getElementById('player-name').textContent = '';
    document.getElementById('player-team').textContent = '';
    
    // Set question with player comparison
    document.getElementById('question-text').innerHTML = `
        <h2>${question.question}</h2>
        <div class="player-comparison">
            <div class="player-option">
                <div class="player-name">${question.player1.name}</div>
                <div class="player-team">${question.player1.team}</div>
                <div class="player-position">${question.player1.position}</div>
            </div>
            <div class="vs-divider">VS</div>
            <div class="player-option">
                <div class="player-name">${question.player2.name}</div>
                <div class="player-team">${question.player2.team}</div>
                <div class="player-position">${question.player2.position}</div>
            </div>
        </div>
    `;
    
    // Set answer options
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        answerOptions.appendChild(btn);
    });
}

function startTimer() {
    if (currentGame.timer) {
        clearInterval(currentGame.timer);
    }
    
    currentGame.timer = setInterval(() => {
        currentGame.timeLeft--;
        updateTimerDisplay();
        
        if (currentGame.timeLeft <= 0) {
            timeUp();
        }
    }, 1000);
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentGame.timeLeft / 60);
    const seconds = currentGame.timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function timeUp() {
    clearInterval(currentGame.timer);
    currentGame.timer = null;
    
    if (currentScreen === 'game-screen') {
        showMessage('Time\'s up!', 'warning');
        
        // In survival mode, time up means game over
        if (currentGame.mode === 'survival') {
            setTimeout(() => {
                if (currentScreen === 'game-screen') {
                    endGame();
                }
            }, 1000); // Reduced from 2000ms to 1000ms for faster gameplay
        } else {
            // Regular mode - continue to next question
        setTimeout(() => {
            if (currentScreen === 'game-screen') {
                nextQuestion();
            }
            }, 1000); // Reduced from 2000ms to 1000ms for faster gameplay
        }
    }
}

function selectAnswer(answerIndex) {
    if (currentGame.timer) {
        clearInterval(currentGame.timer);
        currentGame.timer = null;
    }
    
    const question = currentGame.questions[currentGame.currentQuestion];
    const selectedAnswer = question.options[answerIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
        currentGame.score += 10; // Fixed score for all questions
        currentGame.correctAnswers++;
        currentGame.streak++;
        currentGame.maxStreak = Math.max(currentGame.maxStreak, currentGame.streak);
        showMessage('Correct!', 'success');
        
        // Update UI immediately for survival mode
        if (currentGame.mode === 'survival') {
            document.querySelector('.question-number').textContent = `Survival Streak: ${currentGame.streak}`;
            // Don't show score in survival mode - streak is more important
        }
    } else {
        currentGame.streak = 0;
        showMessage('Incorrect!', 'error');
        
        // In survival mode, end game immediately on wrong answer
        if (currentGame.mode === 'survival') {
            showCorrectAnswer(question, answerIndex, isCorrect);
            setTimeout(() => {
                endGame();
            }, 1000); // Reduced from 2000ms to 1000ms for faster gameplay
            return; // Don't continue to nextQuestion
        }
    }
    
    showCorrectAnswer(question, answerIndex, isCorrect);
    
    setTimeout(() => {
        nextQuestion();
    }, 1000); // Reduced from 2000ms to 1000ms for faster gameplay
}

// Score function removed - using fixed score of 10 points per question

function showCorrectAnswer(question, selectedIndex, isCorrect) {
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        
        if (question.options[index] === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
}

function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ffc107'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 800); // Reduced from 1500ms to 800ms for faster gameplay
}

function nextQuestion() {
    currentGame.currentQuestion++;
    
    // For survival mode, continue indefinitely until wrong answer
    if (currentGame.mode === 'survival') {
        // If we've used all pre-generated questions, cycle back to the beginning
        if (currentGame.currentQuestion >= currentGame.questions.length) {
            currentGame.currentQuestion = 0;
        }
        startQuestion();
    } else {
        // Regular game mode - check if we've reached the question limit
    if (currentGame.currentQuestion < currentGame.questionCount) {
        startQuestion();
    } else {
        endGame();
        }
    }
}

function endGame() {
    showScreen('results-screen');
    
    const finalScore = currentGame.score;
    const totalQuestions = currentGame.questionCount;
    const correctAnswers = currentGame.correctAnswers;
    
    const gameTime = Math.floor((Date.now() - currentGame.gameStartTime) / 1000);
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    
    // Handle survival mode high score saving
    if (currentGame.mode === 'survival') {
        const selectedModes = getSelectedGameModes();
        saveHighScore(currentGame.maxStreak, selectedModes);
        
        // Update results for survival mode
        document.querySelector('.score-number').textContent = currentGame.maxStreak;
        document.querySelector('.score-total').textContent = 'Streak';
        document.querySelector('.final-score h3').textContent = `Survival Streak: ${currentGame.maxStreak}`;
        document.querySelector('.final-score p').textContent = `You survived ${currentGame.maxStreak} questions!`;
        
        // Show and update high score comparison
        document.getElementById('survival-high-score').style.display = 'block';
        document.getElementById('current-streak').textContent = currentGame.maxStreak;
        
        // Load and display best score
        const highScore = localStorage.getItem('ballKnower_highScore');
        if (highScore) {
            const scoreData = JSON.parse(highScore);
            document.getElementById('best-streak-result').textContent = scoreData.streak;
            
            const displayText = scoreData.displayModes ? 
                scoreData.displayModes.join(' + ') : 
                scoreData.modes.map(mode => {
                    switch(mode) {
                        case 'college-guesser': return 'College';
                        case 'jersey-guesser': return 'Jersey';
                        case 'achievement-guesser': return 'Trivia';
                        default: return mode;
                    }
                }).join(' + ');
                
            document.getElementById('best-modes-result').textContent = displayText;
        } else {
            document.getElementById('best-streak-result').textContent = '0';
            document.getElementById('best-modes-result').textContent = '-';
        }
    } else {
        // Regular game mode results - hide survival high score
        document.getElementById('survival-high-score').style.display = 'none';
    document.querySelector('.score-number').textContent = correctAnswers;
    document.querySelector('.score-total').textContent = `/ ${totalQuestions}`;
    document.querySelector('.final-score h3').textContent = `Final Score: ${correctAnswers}/${totalQuestions}`;
    document.querySelector('.final-score p').textContent = `You scored ${Math.round((correctAnswers/totalQuestions) * 100)}%`;
    }
    
    // Update stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems[0].querySelector('.stat-value').textContent = correctAnswers;
    statItems[1].querySelector('.stat-value').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    statItems[2].querySelector('.stat-value').textContent = currentGame.maxStreak;
}

function playAgain() {
    currentGame.currentQuestion = 0;
    currentGame.score = 0;
    currentGame.questions = [];
    
    showScreen('setup-screen');
}

// Multiplayer Functions
function showMultiplayerSetup() {
    showScreen('multiplayer-setup-screen');
}

// Multiplayer game state
let multiplayerGame = {
    roomCode: null,
    isHost: false,
    players: [],
    gameSettings: {
        sport: 'nfl',
        modes: ['trivia'], // Array to support multiple modes
        inputType: 'multiple',
        duration: 60 // Game duration in seconds
    },
    currentQuestion: null,
    timeRemaining: 60,
    gameTimer: null,
    score: 0,
    gameStarted: false,
    realTimeUpdates: null
};

function createRoom() {
    // Reset to default state when creating room
    multiplayerGame.gameSettings = {
        sport: 'nfl',
        modes: ['trivia'],
        inputType: 'multiple'
    };
    
    // Reset UI to default state
    document.querySelectorAll('.sport-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-sport="nfl"]').classList.add('active');
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-mode="trivia"]').classList.add('active');
    
    document.querySelectorAll('.input-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-input="multiple"]').classList.add('active');
    
    document.getElementById('room-setup').style.display = 'block';
    document.getElementById('multiplayer-options').style.display = 'none';
}

function createRoomWithSettings() {
    // Get current selected modes from UI
    const selectedModes = [];
    document.querySelectorAll('.mode-btn.active').forEach(btn => {
        selectedModes.push(btn.dataset.mode);
    });
    
    // Update game settings with current selections
    multiplayerGame.gameSettings.modes = selectedModes;
    
    const roomCode = generateRoomCode();
    multiplayerGame.roomCode = roomCode;
    multiplayerGame.isHost = true;
    multiplayerGame.players = [{ name: 'You (Host)', score: 0, isHost: true }];
    
    document.getElementById('display-room-code').textContent = roomCode;
    document.getElementById('current-room-code').textContent = roomCode;
    
    // Display game settings
    const settingsDisplay = document.getElementById('game-settings-display');
    const modesText = multiplayerGame.gameSettings.modes.map(mode => {
        const modeNames = {
            'trivia': 'Ball Trivia',
            'college': 'College Guesser', 
            'jersey': 'Jersey Guesser'
        };
        return modeNames[mode];
    }).join(', ');
    
    // Format input type display
    const inputDisplay = multiplayerGame.gameSettings.inputType === 'multiple' ? 'Multiple Choice' : 'Type Answer';
    
    // Format duration display
    const durationMinutes = Math.floor(multiplayerGame.gameSettings.duration / 60);
    const durationDisplay = `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
    
    settingsDisplay.innerHTML = `
        <div class="setting-item">
            <span>Sport:</span>
            <span>${multiplayerGame.gameSettings.sport.toUpperCase()}</span>
        </div>
        <div class="setting-item">
            <span>Modes:</span>
            <span>${modesText}</span>
        </div>
        <div class="setting-item">
            <span>Input:</span>
            <span>${inputDisplay}</span>
        </div>
        <div class="setting-item">
            <span>Duration:</span>
            <span>${durationDisplay}</span>
        </div>
    `;
    
    document.getElementById('created-room').style.display = 'block';
    document.getElementById('room-setup').style.display = 'none';
    updatePlayersList();
}

// This function is now merged into the main selectSport function above
// No separate multiplayer sport selection needed

function toggleMode(mode) {
    const button = document.querySelector(`[data-mode="${mode}"]`);
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        // Remove mode if it's the only one selected, otherwise remove it
        if (multiplayerGame.gameSettings.modes.length > 1) {
            multiplayerGame.gameSettings.modes = multiplayerGame.gameSettings.modes.filter(m => m !== mode);
            button.classList.remove('active');
        } else {
            // Don't allow removing the last mode
            showMessage('You must select at least one game mode', 'warning');
        }
    } else {
        // Add mode
        multiplayerGame.gameSettings.modes.push(mode);
        button.classList.add('active');
    }
}

function selectInput(inputType) {
    multiplayerGame.gameSettings.inputType = inputType;
    document.querySelectorAll('.input-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-input="${inputType}"]`).classList.add('active');
}

function selectDuration(duration) {
    multiplayerGame.gameSettings.duration = duration;
    document.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-duration="${duration}"]`).classList.add('active');
}

function showJoinRoom() {
    document.getElementById('room-code-input').style.display = 'block';
}

function joinRoom() {
    const roomCode = document.getElementById('room-code').value.toUpperCase();
    if (roomCode.length === 6) {
        multiplayerGame.roomCode = roomCode;
        multiplayerGame.isHost = false;
        multiplayerGame.players = [{ name: 'You', score: 0, isHost: false }];
        
        document.getElementById('current-room-code').textContent = roomCode;
        showMessage('Joining room...', 'success');
        setTimeout(() => {
            startMultiplayerGame();
        }, 1000);
    } else {
        showMessage('Please enter a valid 6-digit room code', 'error');
    }
}

function copyRoomCode() {
    const roomCode = document.getElementById('display-room-code').textContent;
    navigator.clipboard.writeText(roomCode).then(() => {
        showMessage('Room code copied!', 'success');
    });
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    
    multiplayerGame.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${player.name}</span>
        `;
        playersList.appendChild(playerItem);
    });
    
    document.getElementById('player-count').textContent = multiplayerGame.players.length;
}

function startMultiplayerGame() {
    if (!multiplayerGame.isHost) {
        showMessage('Only the host can start the game', 'warning');
        return;
    }
    
    // Notify all players that game is starting
    notifyGameStart();
    
    showScreen('multiplayer-game-screen');
    multiplayerGame.timeRemaining = multiplayerGame.gameSettings.duration;
    multiplayerGame.score = 0;
    multiplayerGame.gameStarted = true;
    
    // Start the timer
    startMultiplayerTimer();
    
    // Load first question
    loadMultiplayerQuestion();
}

function notifyGameStart() {
    // Simulate notifying other players
    showMessage('Game starting for all players...', 'success');
}

function simulatePlayerJoin() {
    // Simulate a player joining (for testing)
    if (multiplayerGame.isHost && multiplayerGame.players.length < 4) {
        const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const newPlayerName = playerNames[multiplayerGame.players.length - 1];
        
        multiplayerGame.players.push({
            name: newPlayerName,
            score: 0,
            isHost: false
        });
        
        updatePlayersList();
        showMessage(`${newPlayerName} joined the room!`, 'info');
    }
}

function startMultiplayerTimer() {
    multiplayerGame.gameTimer = setInterval(() => {
        multiplayerGame.timeRemaining--;
        document.getElementById('time-remaining').textContent = formatTime(multiplayerGame.timeRemaining);
        
        if (multiplayerGame.timeRemaining <= 0) {
            endMultiplayerGame();
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function loadMultiplayerQuestion() {
    const { sport, modes, inputType } = multiplayerGame.gameSettings;
    console.log(`Loading question for sport: ${sport}, modes: ${modes.join(', ')}`);
    
    // Randomly select a mode from the available modes
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    console.log(`Selected mode: ${randomMode}`);
    
    // Generate question based on randomly selected mode
    if (randomMode === 'trivia') {
        loadTriviaQuestion(sport);
    } else if (randomMode === 'college') {
        loadCollegeQuestion(sport);
    } else if (randomMode === 'jersey') {
        loadJerseyQuestion(sport);
    }
}

function loadTriviaQuestion(sport) {
    // Handle "both" sport option
    let targetSport = sport;
    if (sport === 'both') {
        // Randomly choose between NFL and NBA for "both"
        targetSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    }
    
    // Use the existing trivia system
    dataLoader.createTriviaQuestion(targetSport).then(question => {
        if (question) {
            displayMultiplayerQuestion(question);
        } else {
            console.error('Failed to load trivia question');
            showMessage('Failed to load question', 'error');
        }
    }).catch(error => {
        console.error('Error loading trivia question:', error);
        showMessage('Error loading question', 'error');
    });
}

function loadCollegeQuestion(sport) {
    // Handle "both" sport option
    let targetSport = sport;
    if (sport === 'both') {
        // Randomly choose between NFL and NBA for "both"
        targetSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    }
    
    dataLoader.loadPlayers(targetSport).then(players => {
        if (players.length > 0) {
            const question = dataLoader.createCollegeQuestion(players[0], players);
            displayMultiplayerQuestion(question);
        }
    });
}

function loadJerseyQuestion(sport) {
    // Handle "both" sport option
    let targetSport = sport;
    if (sport === 'both') {
        // Randomly choose between NFL and NBA for "both"
        targetSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    }
    
    dataLoader.loadPlayers(targetSport).then(players => {
        if (players.length > 0) {
            const question = dataLoader.createJerseyQuestion(players[0], players);
            displayMultiplayerQuestion(question);
        }
    });
}

function displayMultiplayerQuestion(question) {
    multiplayerGame.currentQuestion = question;
    
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('question-options');
    const textInputContainer = document.getElementById('text-input-container');
    
    if (multiplayerGame.gameSettings.inputType === 'multiple') {
        optionsContainer.style.display = 'block';
        textInputContainer.style.display = 'none';
        
        optionsContainer.innerHTML = '';
        question.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = choice.text;
            button.onclick = () => selectMultiplayerAnswer(choice.id);
            optionsContainer.appendChild(button);
        });
    } else {
        optionsContainer.style.display = 'none';
        textInputContainer.style.display = 'block';
        document.getElementById('text-answer').value = '';
    }
}

function selectMultiplayerAnswer(choiceId) {
    const isCorrect = choiceId === multiplayerGame.currentQuestion.correctChoiceId;
    handleMultiplayerAnswer(isCorrect);
}

function submitTextAnswer() {
    const userAnswer = document.getElementById('text-answer').value.trim().toLowerCase();
    const correctAnswer = multiplayerGame.currentQuestion.correctAnswer.toLowerCase();
    
    // Simple answer matching (can be improved)
    const isCorrect = userAnswer === correctAnswer || 
                     userAnswer.includes(correctAnswer) || 
                     correctAnswer.includes(userAnswer);
    
    handleMultiplayerAnswer(isCorrect);
}

function handleMultiplayerAnswer(isCorrect) {
    if (isCorrect) {
        multiplayerGame.score++;
        showMessage('Correct! +1 point', 'success');
    } else {
        showMessage('Wrong answer', 'error');
    }
    
    // Update player score in the players array
    const currentPlayer = multiplayerGame.players.find(p => p.isHost === multiplayerGame.isHost);
    if (currentPlayer) {
        currentPlayer.score = multiplayerGame.score;
    }
    
    // Simulate opponent answers (for testing)
    simulateOpponentAnswers();
    
    // Update leaderboard
    updateLeaderboard();
    
    // Load next question after a short delay
    setTimeout(() => {
        loadMultiplayerQuestion();
    }, 2000);
}

function simulateOpponentAnswers() {
    // Simulate other players answering
    const opponents = multiplayerGame.players.filter(p => p.isHost !== multiplayerGame.isHost);
    opponents.forEach(opponent => {
        // Randomly determine if opponent gets it right
        const isCorrect = Math.random() > 0.3; // 70% chance of being correct
        if (isCorrect) {
            opponent.score++;
        }
        
        // Show opponent answer
        showOpponentAnswer(opponent.name, isCorrect);
    });
}

function showOpponentAnswer(playerName, isCorrect) {
    const opponentAnswers = document.getElementById('opponent-answers');
    const opponentList = document.getElementById('opponent-list');
    
    opponentAnswers.style.display = 'block';
    
    const answerItem = document.createElement('div');
    answerItem.className = 'opponent-answer-item';
    answerItem.innerHTML = `
        <span class="opponent-name">${playerName}:</span>
        <span class="opponent-result ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct' : '✗ Wrong'}
        </span>
    `;
    
    opponentList.appendChild(answerItem);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (answerItem.parentNode) {
            answerItem.parentNode.removeChild(answerItem);
        }
    }, 3000);
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    // Sort players by score
    const sortedPlayers = [...multiplayerGame.players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'leaderboard-item';
        playerItem.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="player-name">${player.name}</span>
            <span class="score">${player.score}</span>
        `;
        leaderboardList.appendChild(playerItem);
    });
}

function endMultiplayerGame() {
    clearInterval(multiplayerGame.gameTimer);
    
    // Show final results
    showMessage(`Game Over! Your score: ${multiplayerGame.score}`, 'info');
    
    // Update final leaderboard
    updateLeaderboard();
    
    // Show end game options
    setTimeout(() => {
        if (multiplayerGame.isHost) {
            showMessage('Game ended. You can start a new game or leave.', 'info');
        } else {
            showMessage('Game ended. You can leave the room.', 'info');
        }
    }, 2000);
}

function leaveMultiplayerGame() {
    if (multiplayerGame.gameTimer) {
        clearInterval(multiplayerGame.gameTimer);
    }
    
    // Reset multiplayer state
    multiplayerGame = {
        roomCode: null,
        isHost: false,
        players: [],
        gameSettings: {
            sport: 'nfl',
            modes: ['trivia'],
            inputType: 'multiple'
        },
        currentQuestion: null,
        timeRemaining: 60,
        gameTimer: null,
        score: 0
    };
    
    showScreen('home-screen');
}


function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Leaderboard Functions
function showLeaderboardTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateLeaderboardContent(tab);
}

function updateLeaderboardContent(tab) {
    const results = JSON.parse(localStorage.getItem('ballKnowerResults') || '[]');
    
    let filteredResults = results;
    if (tab === 'weekly') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filteredResults = results.filter(r => new Date(r.date) >= weekAgo);
    } else if (tab === 'monthly') {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        filteredResults = results.filter(r => new Date(r.date) >= monthAgo);
    }
    
    filteredResults.sort((a, b) => b.score - a.score);
    
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    filteredResults.slice(0, 10).forEach((result, index) => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${index === 0 ? 'rank-1' : ''}`;
        
        item.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="player-info">
                <div class="player-avatar">BK</div>
                <div class="player-details">
                    <span class="player-name">Ball Knower Player</span>
                    <span class="player-stats">${result.mode} • ${result.sport.toUpperCase()}</span>
                </div>
            </div>
            <div class="score">${result.score}</div>
        `;
        
        leaderboardList.appendChild(item);
    });
}

// Quick Play - Random Mode
function quickPlay() {
    const modes = ['college-guesser', 'jersey-guesser', 'achievement-guesser'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    
    currentGame.sport = randomSport;
    startGame(randomMode);
}

// Update Personal Stats on Homepage
function updatePersonalStats() {
    const gameResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
    
    if (gameResults.length === 0) {
        document.getElementById('best-streak').textContent = '0';
        document.getElementById('accuracy').textContent = '0%';
        document.getElementById('games-played').textContent = '0';
        return;
    }
    
    // Calculate best streak
    const bestStreak = Math.max(...gameResults.map(r => r.streak || 0));
    document.getElementById('best-streak').textContent = bestStreak;
    
    // Calculate accuracy
    const totalCorrect = gameResults.reduce((sum, r) => sum + (r.correctAnswers || 0), 0);
    const totalQuestions = gameResults.reduce((sum, r) => sum + (r.totalQuestions || r.questionCount || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    // Games played
    document.getElementById('games-played').textContent = gameResults.length;
}

// Initialize stats on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePersonalStats();
});
