/**
 * Trivia Questions Loader
 * Loads NBA and NFL trivia questions from separate JSON files
 */

class TriviaLoader {
    constructor() {
        this.cache = {
            nfl: [],
            nba: []
        };
    }

    /**
     * Load trivia questions for a specific sport
     * @param {string} sport - 'nfl' or 'nba'
     * @returns {Promise<Array>} Array of trivia questions
     */
    async loadTriviaQuestions(sport) {
        const sportLower = sport.toLowerCase();
        
        // Return cached if available
        if (this.cache[sportLower].length > 0) {
            console.log(`📋 Using cached ${sportLower} trivia: ${this.cache[sportLower].length} questions`);
            return this.cache[sportLower];
        }

        try {
            // Load from separate JSON files
            const response = await fetch(`data/trivia/${sportLower}_questions.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${sportLower} trivia questions`);
            }
            
            const questions = await response.json();
            this.cache[sportLower] = questions;
            
            console.log(`📚 Loaded ${sportLower} trivia: ${questions.length} questions`);
            return questions;
            
        } catch (error) {
            console.error(`❌ Error loading ${sportLower} trivia questions:`, error);
            return [];
        }
    }

    /**
     * Get a random trivia question for a sport
     * @param {string} sport - 'nfl' or 'nba'
     * @returns {Promise<Object|null>} Random trivia question or null
     */
    async getRandomTriviaQuestion(sport) {
        const questions = await this.loadTriviaQuestions(sport);
        if (questions.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
    }

    /**
     * Get multiple random trivia questions
     * @param {string} sport - 'nfl' or 'nba'
     * @param {number} count - Number of questions to get
     * @returns {Promise<Array>} Array of random trivia questions
     */
    async getRandomTriviaQuestions(sport, count = 10) {
        const questions = await this.loadTriviaQuestions(sport);
        if (questions.length === 0) return [];
        
        // Shuffle and take the requested number
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, questions.length));
    }

    /**
     * Get trivia questions by category
     * @param {string} sport - 'nfl' or 'nba'
     * @param {string} category - Category to filter by
     * @returns {Promise<Array>} Array of trivia questions in category
     */
    async getTriviaQuestionsByCategory(sport, category) {
        const questions = await this.loadTriviaQuestions(sport);
        return questions.filter(q => q.category === category);
    }

    /**
     * Get trivia questions by difficulty
     * @param {string} sport - 'nfl' or 'nba'
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {Promise<Array>} Array of trivia questions with difficulty
     */
    async getTriviaQuestionsByDifficulty(sport, difficulty) {
        const questions = await this.loadTriviaQuestions(sport);
        return questions.filter(q => q.difficulty === difficulty);
    }
}

// Create global instance
window.triviaLoader = new TriviaLoader();
