// Ball Knower - Static Data Loader
// Replaces heavy API calls with fast CDN-cached JSON

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.dataVersion = null;
        this.triviaQuestions = {
            nfl: [],
            nba: []
        };
    }

    // Helper to resolve absolute base path for GitHub Pages
    resolveBase() {
        return `${location.origin}/ball-knower/`;
    }

    // Helper to try multiple URLs until one works
    async tryFetch(paths) {
        for (const url of paths) {
            try {

                const r = await fetch(url, { cache: 'force-cache' });
                if (r.ok) return await r.json();
            } catch {}
        }
        throw new Error('All candidate URLs failed: ' + paths.join(', '));
    }

    /**
     * Load well-known players from Excel file
     * @param {string} sport - 'NFL', 'NBA', or 'both' (default: 'both')
     */
    async loadPlayers(sport = 'both') {
        const cacheKey = `players_${sport}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

        let players = [];

        // Load based on sport selection
        if (sport === 'nfl' || sport === 'NFL') {
            if (typeof NFL_PLAYERS !== 'undefined' && NFL_PLAYERS && NFL_PLAYERS.length > 0) {
                players = NFL_PLAYERS;
                console.log(`✅ Using NFL players: ${players.length} players`);
            }
        } else if (sport === 'nba' || sport === 'NBA') {
            if (typeof NBA_PLAYERS !== 'undefined' && NBA_PLAYERS && NBA_PLAYERS.length > 0) {
                players = NBA_PLAYERS;
                console.log(`✅ Using NBA players: ${players.length} players`);
            }
        } else {
            // Both or default - combine NFL and NBA
            const nflPlayers = (typeof NFL_PLAYERS !== 'undefined' && NFL_PLAYERS) ? NFL_PLAYERS : [];
            const nbaPlayers = (typeof NBA_PLAYERS !== 'undefined' && NBA_PLAYERS) ? NBA_PLAYERS : [];
            players = [...nflPlayers, ...nbaPlayers];
            console.log(`✅ Using combined players: ${nflPlayers.length} NFL + ${nbaPlayers.length} NBA = ${players.length} total`);
        }

        // Fallback to WELL_KNOWN_PLAYERS if specific arrays don't exist
        if (players.length === 0 && typeof WELL_KNOWN_PLAYERS !== 'undefined' && WELL_KNOWN_PLAYERS && WELL_KNOWN_PLAYERS.length > 0) {
            console.log(`⚠️ Using fallback WELL_KNOWN_PLAYERS: ${WELL_KNOWN_PLAYERS.length} players`);
            // Filter by sport if needed
            if (sport === 'nfl' || sport === 'NFL') {
                players = WELL_KNOWN_PLAYERS.filter(p => p.league === 'NFL');
            } else if (sport === 'nba' || sport === 'NBA') {
                players = WELL_KNOWN_PLAYERS.filter(p => p.league === 'NBA');
            } else {
                players = WELL_KNOWN_PLAYERS;
            }
        }

        if (players.length === 0) {
            console.error('❌ No players found for sport:', sport);
            return [];
        }

        this.cache.set(cacheKey, players);
        return players;
    }

    /**
     * Check if data version has changed and clear cache if needed
     */
    async checkDataVersion() {
        const base = this.resolveBase();
        try {
            const r = await fetch(`${base}data_version.json`, { cache: 'no-cache' });
            if (!r.ok) return;
            const { version } = await r.json();
            const prev = localStorage.getItem('data_version');
            if (prev && prev !== version) this.cache.clear();
            if (!prev || prev !== version) localStorage.setItem('data_version', version);
        } catch {}
    }

    /**
     * Load trivia questions from JSON file
     * @param {string} sport - 'nfl' or 'nba'
     */
    async loadTriviaQuestions(sport) {
        const sportLower = sport.toLowerCase();
        console.log(`🔍 Loading trivia questions for sport: ${sportLower}`);
        
        // Return cached if available
        if (this.triviaQuestions[sportLower].length > 0) {
            console.log(`📋 Using cached ${sportLower} trivia: ${this.triviaQuestions[sportLower].length} questions`);
            return this.triviaQuestions[sportLower];
        }

        try {
            // Use the new trivia loader
            if (typeof triviaLoader !== 'undefined') {
                const questions = await triviaLoader.loadTriviaQuestions(sportLower);
                this.triviaQuestions[sportLower] = questions;
                return questions;
            } else {
                // Fallback to embedded questions
                if (sportLower === 'nfl' && typeof NFL_TRIVIA_QUESTIONS !== 'undefined') {
                    console.log(`📚 Using embedded NFL trivia: ${NFL_TRIVIA_QUESTIONS.length} questions`);
                    this.triviaQuestions[sportLower] = NFL_TRIVIA_QUESTIONS;
                    return NFL_TRIVIA_QUESTIONS;
                } else if (sportLower === 'nba' && typeof NBA_TRIVIA_QUESTIONS !== 'undefined') {
                    console.log(`🏀 Using embedded NBA trivia: ${NBA_TRIVIA_QUESTIONS.length} questions`);
                    this.triviaQuestions[sportLower] = NBA_TRIVIA_QUESTIONS;
                    return NBA_TRIVIA_QUESTIONS;
                } else {
                    console.warn(`⚠️ No trivia found for ${sportLower}`);
                    return [];
                }
            }
        } catch (error) {
            console.error(`❌ Error loading ${sport} trivia questions:`, error);
            return [];
        }
    }

    /**
     * Create a trivia question
     * @param {string} sport - 'nfl', 'nba', or 'both'
     */
    async createTriviaQuestion(sport) {
        let selectedSport = sport;
        
        // If "both" is selected, randomly pick NFL or NBA for this question
        if (sport === 'both') {
            selectedSport = Math.random() < 0.5 ? 'nfl' : 'nba';
        }
        
        const questions = await this.loadTriviaQuestions(selectedSport);
        
        if (questions.length === 0) {
            return null;
        }

        // Pick a random question
        const triviaQ = questions[Math.floor(Math.random() * questions.length)];

        // Convert to game question format
        const options = triviaQ.choices.map(choice => choice.text);
        const correctAnswer = triviaQ.choices.find(c => c.id === triviaQ.correctChoiceId)?.text;

        if (!correctAnswer) {
            console.error('Trivia question missing correct answer:', triviaQ);
            return null;
        }

        return {
            type: 'trivia',
            question: triviaQ.question,
            options: options,
            correctAnswer: correctAnswer,
            category: triviaQ.category || 'General',
            difficulty: triviaQ.difficulty || 'medium',
            league: selectedSport.toUpperCase()
        };
    }

    /**
     * Create a college question with a specific player
     */
    createCollegeQuestionWithPlayer(correctPlayer, allPlayers) {
        if (!correctPlayer || !correctPlayer.college) return null;

        const correctCollege = correctPlayer.college;
        const wrongColleges = [];
        const usedColleges = new Set([correctCollege]);

        // Shuffle players to get random wrong answers each time
        const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);

        for (const player of shuffledPlayers) {
            if (player.college && !usedColleges.has(player.college) && wrongColleges.length < 3) {
                wrongColleges.push(player.college);
                usedColleges.add(player.college);
            }
            if (wrongColleges.length >= 3) break;
        }

        if (wrongColleges.length < 3) return null;

        const options = [correctCollege, ...wrongColleges].sort(() => Math.random() - 0.5);

        // Use different wording for NBA players (could be college or origin)
        const questionText = correctPlayer.league === 'NBA' 
            ? `Where did ${correctPlayer.name} play college basketball?` 
            : `Which college did ${correctPlayer.name} attend?`;

        return {
            type: 'college',
            player: correctPlayer,
            question: questionText,
            options: options,
            correctAnswer: correctCollege
        };
    }

    /**
     * Create a college question (legacy method)
     */
    createCollegeQuestion(players) {
        if (players.length < 4) return null;

        const correctPlayer = players[Math.floor(Math.random() * players.length)];
        const correctCollege = correctPlayer.college;
        if (!correctCollege) return null;

        const wrongColleges = [];
        const usedColleges = new Set([correctCollege]);

        // Shuffle players to get random wrong answers each time
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

        for (const player of shuffledPlayers) {
            if (player.college && !usedColleges.has(player.college) && wrongColleges.length < 3) {
                wrongColleges.push(player.college);
                usedColleges.add(player.college);
            }
            if (wrongColleges.length >= 3) break;
        }

        if (wrongColleges.length < 3) return null;

        const options = [correctCollege, ...wrongColleges].sort(() => Math.random() - 0.5);

        // Use different wording for NBA players (could be college or origin)
        const questionText = correctPlayer.league === 'NBA' 
            ? `Where did ${correctPlayer.name} play college basketball?` 
            : `Which college did ${correctPlayer.name} attend?`;

        return {
            type: 'college',
            player: correctPlayer,
            question: questionText,
            options: options,
            correctAnswer: correctCollege
        };
    }

    /**
     * Create a jersey question with a specific player
     */
    createJerseyQuestionWithPlayer(correctPlayer, allPlayers) {
        if (!correctPlayer || !correctPlayer.jersey || correctPlayer.jersey <= 0) return null;

        const correctJersey = correctPlayer.jersey;
        const wrongJerseys = [];
        const usedJerseys = new Set([correctJersey]);

        // Shuffle players to get random wrong jerseys each time
        const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);

        for (const player of shuffledPlayers) {
            if (player.jersey && !usedJerseys.has(player.jersey) && wrongJerseys.length < 3) {
                wrongJerseys.push(player.jersey);
                usedJerseys.add(player.jersey);
            }
            if (wrongJerseys.length >= 3) break;
        }

        if (wrongJerseys.length < 3) return null;

        const options = [correctJersey, ...wrongJerseys].sort(() => Math.random() - 0.5);

        // Use present/past tense appropriately
        const verb = correctPlayer.league === 'NBA' ? 'wore' : 'wear';

        return {
            type: 'jersey',
            player: correctPlayer,
            question: `What jersey number does ${correctPlayer.name} ${verb}?`,
            options: options,
            correctAnswer: correctJersey
        };
    }

    /**
     * Create a jersey question (legacy method)
     */
    createJerseyQuestion(players) {
        if (players.length < 4) return null;

        const playersWithJerseys = players.filter(p => p.jersey && p.jersey > 0);
        if (playersWithJerseys.length === 0) return null;

        const correctPlayer = playersWithJerseys[Math.floor(Math.random() * playersWithJerseys.length)];
        const correctJersey = correctPlayer.jersey;

        const wrongJerseys = [];
        const usedJerseys = new Set([correctJersey]);

        // Shuffle players to get random wrong jerseys each time
        const shuffledPlayers = [...playersWithJerseys].sort(() => Math.random() - 0.5);

        for (const player of shuffledPlayers) {
            if (player.jersey && !usedJerseys.has(player.jersey) && wrongJerseys.length < 3) {
                wrongJerseys.push(player.jersey);
                usedJerseys.add(player.jersey);
            }
            if (wrongJerseys.length >= 3) break;
        }

        if (wrongJerseys.length < 3) return null;

        const options = [correctJersey, ...wrongJerseys].sort(() => Math.random() - 0.5);

        // Use present/past tense appropriately
        const verb = correctPlayer.league === 'NBA' ? 'wore' : 'wear';

        return {
            type: 'jersey',
            player: correctPlayer,
            question: `What jersey number does ${correctPlayer.name} ${verb}?`,
            options: options,
            correctAnswer: correctJersey
        };
    }
}

// Create global instance
const dataLoader = new DataLoader();