// Ball Knower - Static Data Loader
// Replaces heavy API calls with fast CDN-cached JSON

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.dataVersion = null;
    }

    // Helper to resolve the correct base path for both local and GitHub Pages
    resolveBase() {
        const path = window.location.pathname;
        const pagesBase = path.match(/^(.*\/ball-knower\/)/);
        if (pagesBase) return pagesBase[1];           // e.g., /ball-knower/
        return path.endsWith('/') ? path : path.replace(/[^/]+$/, '/'); // local
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
     * Load players for a specific league and difficulty tier
     */
    async loadTier(league, tier) {
        const cacheKey = `${league}_${tier}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

        const base = this.resolveBase();
        const candidates = [
            `${base}${league}_${tier}.json`,        // root (GitHub Pages root of repo)
            `${base}data/${league}_${tier}.json`,   // /data folder
            `data/${league}_${tier}.json`           // local fallback
        ];

        try {
            const players = await this.tryFetch(candidates);
            this.cache.set(cacheKey, players);
            console.log(`✅ Loaded ${players.length} ${league} ${tier} players`);
            return players;
        } catch (e) {
            console.error('❌ Failed to load', cacheKey, e);
            return [];
        }
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
            correct: correctCollege
        };
    }

    /**
     * Create a jersey question
     */
    createJerseyQuestion(players) {
        if (players.length < 4) return null;

        const playersWithJerseys = players.filter(p => p.jersey_current && p.jersey_current > 0);
        if (playersWithJerseys.length === 0) return null;

        const correctPlayer = playersWithJerseys[Math.floor(Math.random() * playersWithJerseys.length)];
        const correctJersey = correctPlayer.jersey_current;

        const wrongJerseys = [];
        const usedJerseys = new Set([correctJersey]);

        for (const player of playersWithJerseys) {
            if (player.jersey_current && !usedJerseys.has(player.jersey_current) && wrongJerseys.length < 3) {
                wrongJerseys.push(player.jersey_current);
                usedJerseys.add(player.jersey_current);
            }
        }

        if (wrongJerseys.length < 3) return null;

        const options = [correctJersey, ...wrongJerseys].sort(() => Math.random() - 0.5);

        return {
            type: 'jersey',
            player: correctPlayer,
            question: `What jersey number does ${correctPlayer.name} wear?`,
            options: options,
            correct: correctJersey
        };
    }
}

// Create global instance
const dataLoader = new DataLoader();