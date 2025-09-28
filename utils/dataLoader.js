// Ball Knower - Static Data Loader
// Replaces heavy API calls with fast CDN-cached JSON

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.dataVersion = null;
    }

    /**
     * Load players for a specific league and difficulty tier
     */
    async loadTier(league, tier) {
        const cacheKey = `${league}_${tier}`;
        
        // Return cached data if available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`data/${league}_${tier}.json`, {
                cache: 'force-cache'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to load ${cacheKey}: ${response.status}`);
            }
            
            const players = await response.json();
            this.cache.set(cacheKey, players);
            
            console.log(`✅ Loaded ${players.length} ${league} ${tier} players`);
            return players;
        } catch (error) {
            console.error(`❌ Failed to load ${cacheKey}:`, error);
            return [];
        }
    }

    /**
     * Check if data version has changed and clear cache if needed
     */
    async checkDataVersion() {
        try {
            const response = await fetch('data/data_version.json', {
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const versionData = await response.json();
                
                if (this.dataVersion && this.dataVersion !== versionData.version) {
                    console.log('🔄 Data version changed, clearing cache');
                    this.cache.clear();
                }
                
                this.dataVersion = versionData.version;
                return versionData;
            }
        } catch (error) {
            console.warn('Could not check data version:', error);
        }
        
        return null;
    }

    /**
     * Generate smart distractors for multiple choice questions
     */
    generateDistractors(correctAnswer, allPlayers, type, count = 3) {
        const distractors = new Set();
        
        // Filter players to create realistic wrong answers
        const candidates = allPlayers.filter(p => {
            if (type === 'college') {
                return p.college && p.college !== correctAnswer;
            } else if (type === 'jersey') {
                return p.jersey_current && p.jersey_current !== correctAnswer;
            } else if (type === 'team') {
                return p.team && p.team !== correctAnswer;
            }
            return false;
        });

        // Shuffle and take unique distractors
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        
        for (const candidate of shuffled) {
            if (distractors.size >= count) break;
            
            let value;
            if (type === 'college') value = candidate.college;
            else if (type === 'jersey') value = candidate.jersey_current;
            else if (type === 'team') value = candidate.team;
            
            if (value && value !== correctAnswer) {
                distractors.add(value);
            }
        }

        // Fill with generic options if needed
        while (distractors.size < count) {
            if (type === 'college') {
                const generic = ['Alabama', 'Ohio State', 'Michigan', 'Georgia', 'Clemson', 'Notre Dame', 'USC', 'Texas', 'Florida', 'Penn State'];
                const option = generic[Math.floor(Math.random() * generic.length)];
                if (option !== correctAnswer) distractors.add(option);
            } else if (type === 'jersey') {
                const option = Math.floor(Math.random() * 99) + 1;
                if (option !== correctAnswer) distractors.add(option.toString());
            } else if (type === 'team') {
                const generic = ['Patriots', 'Cowboys', 'Packers', 'Steelers', 'Giants', 'Eagles', '49ers', 'Bears'];
                const option = generic[Math.floor(Math.random() * generic.length)];
                if (option !== correctAnswer) distractors.add(option);
            }
        }

        return Array.from(distractors).slice(0, count);
    }

    /**
     * Create a college question with smart distractors
     */
    createCollegeQuestion(player, allPlayers) {
        if (!player.college) return null;

        const distractors = this.generateDistractors(player.college, allPlayers, 'college', 3);
        const options = [player.college, ...distractors].sort(() => Math.random() - 0.5);

        return {
            type: 'college',
            player: player,
            question: `What college did ${player.name} attend?`,
            options: options,
            correctAnswer: player.college,
            correctIndex: options.indexOf(player.college)
        };
    }

    /**
     * Create a jersey question with smart distractors
     */
    createJerseyQuestion(player, allPlayers) {
        if (!player.jersey_current) return null;

        const distractors = this.generateDistractors(player.jersey_current, allPlayers, 'jersey', 3);
        const options = [player.jersey_current.toString(), ...distractors].sort(() => Math.random() - 0.5);

        return {
            type: 'jersey',
            player: player,
            question: `What jersey number does ${player.name} wear?`,
            options: options,
            correctAnswer: player.jersey_current.toString(),
            correctIndex: options.indexOf(player.jersey_current.toString())
        };
    }

    /**
     * Create a team question with smart distractors
     */
    createTeamQuestion(player, allPlayers) {
        if (!player.team) return null;

        const distractors = this.generateDistractors(player.team, allPlayers, 'team', 3);
        const options = [player.team, ...distractors].sort(() => Math.random() - 0.5);

        return {
            type: 'team',
            player: player,
            question: `What team does ${player.name} play for?`,
            options: options,
            correctAnswer: player.team,
            correctIndex: options.indexOf(player.team)
        };
    }
}

// Global instance
const dataLoader = new DataLoader();
