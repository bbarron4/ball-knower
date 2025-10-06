import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for active rooms (in production, use Redis or database)
const activeRooms = new Map();

// Generate a random room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create a new multiplayer room
router.post('/create', authenticate, [
    body('gameSettings.sport').isIn(['nfl', 'nba', 'both']),
    body('gameSettings.modes').isArray(),
    body('gameSettings.inputType').isIn(['multiple', 'text']),
    body('gameSettings.duration').isInt({ min: 30, max: 300 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { gameSettings } = req.body;
        const roomCode = generateRoomCode();
        
        // Create room with host as first player
        const room = {
            id: roomCode,
            hostId: req.user.id,
            gameSettings: gameSettings,
            players: [{
                id: req.user.id,
                username: req.user.username,
                displayName: req.user.display_name || req.user.username,
                isHost: true,
                score: 0
            }],
            status: 'waiting', // waiting, starting, active, finished
            createdAt: new Date(),
            gameStarted: false
        };

        activeRooms.set(roomCode, room);

        res.json({
            roomCode: roomCode,
            room: room
        });
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// Join an existing room
router.post('/join/:roomCode', authenticate, async (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = activeRooms.get(roomCode.toUpperCase());

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.status !== 'waiting') {
            return res.status(400).json({ error: 'Room is not accepting new players' });
        }

        if (room.players.length >= 4) {
            return res.status(400).json({ error: 'Room is full' });
        }

        // Check if player is already in the room
        const existingPlayer = room.players.find(p => p.id === req.user.id);
        if (existingPlayer) {
            return res.json({ room: room });
        }

        // Add player to room
        const newPlayer = {
            id: req.user.id,
            username: req.user.username,
            displayName: req.user.display_name || req.user.username,
            isHost: false,
            score: 0
        };

        room.players.push(newPlayer);

        res.json({ room: room });
    } catch (error) {
        console.error('Join room error:', error);
        res.status(500).json({ error: 'Failed to join room' });
    }
});

// Get room status
router.get('/:roomCode', authenticate, async (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = activeRooms.get(roomCode.toUpperCase());

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ room: room });
    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({ error: 'Failed to get room' });
    }
});

// Start the game (host only)
router.post('/:roomCode/start', authenticate, async (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = activeRooms.get(roomCode.toUpperCase());

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.hostId !== req.user.id) {
            return res.status(403).json({ error: 'Only the host can start the game' });
        }

        if (room.players.length < 2) {
            return res.status(400).json({ error: 'Need at least 2 players to start' });
        }

        room.status = 'starting';
        room.gameStarted = true;
        room.countdownStartTime = new Date(); // Add server timestamp for countdown sync

        res.json({ room: room });
    } catch (error) {
        console.error('Start game error:', error);
        res.status(500).json({ error: 'Failed to start game' });
    }
});

// Leave room
router.post('/:roomCode/leave', authenticate, async (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = activeRooms.get(roomCode.toUpperCase());

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Remove player from room
        room.players = room.players.filter(p => p.id !== req.user.id);

        // If host left, assign new host or close room
        if (room.hostId === req.user.id) {
            if (room.players.length > 0) {
                room.hostId = room.players[0].id;
                room.players[0].isHost = true;
            } else {
                activeRooms.delete(roomCode.toUpperCase());
                return res.json({ message: 'Room closed' });
            }
        }

        res.json({ room: room });
    } catch (error) {
        console.error('Leave room error:', error);
        res.status(500).json({ error: 'Failed to leave room' });
    }
});

// Clean up old rooms (run periodically)
setInterval(() => {
    const now = new Date();
    for (const [roomCode, room] of activeRooms.entries()) {
        const ageMinutes = (now - room.createdAt) / (1000 * 60);
        if (ageMinutes > 60) { // Remove rooms older than 1 hour
            activeRooms.delete(roomCode);
            console.log(`Cleaned up old room: ${roomCode}`);
        }
    }
}, 5 * 60 * 1000); // Run every 5 minutes

// Update player score
router.post('/:roomCode/score', authenticate, async (req, res) => {
    try {
        const { roomCode } = req.params;
        const { score } = req.body;
        const room = activeRooms.get(roomCode.toUpperCase());

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Find the player and update their score
        const player = room.players.find(p => p.id === req.user.id);
        if (player) {
            player.score = score;
            console.log(`Updated score for player ${player.displayName || player.username}: ${score}`);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Update score error:', error);
        res.status(500).json({ error: 'Failed to update score' });
    }
});

export default router;
