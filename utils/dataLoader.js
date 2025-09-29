// Ball Knower - Static Data Loader
// Replaces heavy API calls with fast CDN-cached JSON

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.dataVersion = null;
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
     */
    async loadPlayers() {
        if (this.cache.has('players')) return this.cache.get('players');

        // Use well-known players (guaranteed to work)
        if (typeof WELL_KNOWN_PLAYERS !== 'undefined' && WELL_KNOWN_PLAYERS && WELL_KNOWN_PLAYERS.length > 0) {
            console.log(`✅ Using well-known players: ${WELL_KNOWN_PLAYERS.length} players`);
            this.cache.set('players', WELL_KNOWN_PLAYERS);
            return WELL_KNOWN_PLAYERS;
        }

        console.error('❌ WELL_KNOWN_PLAYERS not found');
        return [];
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
     * Create a college question
     */
    createCollegeQuestion(players) {
        if (players.length < 4) return null;

        const correctPlayer = players[Math.floor(Math.random() * players.length)];
        const correctCollege = correctPlayer.college;
        if (!correctCollege) return null;

        const wrongColleges = [];
        const usedColleges = new Set([correctCollege]);

        for (const player of players) {
            if (player.college && !usedColleges.has(player.college) && wrongColleges.length < 3) {
                wrongColleges.push(player.college);
                usedColleges.add(player.college);
            }
        }

        if (wrongColleges.length < 3) return null;

        const options = [correctCollege, ...wrongColleges].sort(() => Math.random() - 0.5);

        return {
            type: 'college',
            player: correctPlayer,
            question: `Which college did ${correctPlayer.name} attend?`,
            options: options,
            correctAnswer: correctCollege
        };
    }

    /**
     * Create a jersey question
     */
    createJerseyQuestion(players) {
        if (players.length < 4) return null;

        const playersWithJerseys = players.filter(p => p.jersey && p.jersey > 0);
        if (playersWithJerseys.length === 0) return null;

        const correctPlayer = playersWithJerseys[Math.floor(Math.random() * playersWithJerseys.length)];
        const correctJersey = correctPlayer.jersey;

        const wrongJerseys = [];
        const usedJerseys = new Set([correctJersey]);

        for (const player of playersWithJerseys) {
            if (player.jersey && !usedJerseys.has(player.jersey) && wrongJerseys.length < 3) {
                wrongJerseys.push(player.jersey);
                usedJerseys.add(player.jersey);
            }
        }

        if (wrongJerseys.length < 3) return null;

        const options = [correctJersey, ...wrongJerseys].sort(() => Math.random() - 0.5);

        return {
            type: 'jersey',
            player: correctPlayer,
            question: `What jersey number does ${correctPlayer.name} wear?`,
            options: options,
            correctAnswer: correctJersey
        };
    }
}

// Create global instance
const dataLoader = new DataLoader();