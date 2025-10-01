import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.username, u.display_name, u.favorite_team, u.bio, u.created_at,
              s.current_pick_streak, s.best_pick_streak
       FROM users u
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    const badges = await query(
      `SELECT b.code, b.name, b.description, b.icon, ub.awarded_at
       FROM user_badges ub
       JOIN badges b ON ub.badge_code = b.code
       WHERE ub.user_id = $1
       ORDER BY ub.awarded_at DESC`,
      [req.user.id]
    );

    res.json({ user: result.rows[0], badges: badges.rows });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

router.patch('/me', authenticate, [
  body('username').optional().isLength({ min: 3, max: 50 }).trim(),
  body('display_name').optional().isLength({ max: 100 }).trim(),
  body('favorite_team').optional().trim(),
  body('bio').optional().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, display_name, favorite_team, bio } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username) {
      const existing = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.user.id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }

    if (display_name !== undefined) {
      updates.push(`display_name = $${paramCount++}`);
      values.push(display_name);
    }

    if (favorite_team !== undefined) {
      updates.push(`favorite_team = $${paramCount++}`);
      values.push(favorite_team);
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.id);
    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, display_name, favorite_team, bio`,
      values
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.display_name, u.favorite_team, u.bio, u.created_at,
              s.current_pick_streak, s.best_pick_streak
       FROM users u
       LEFT JOIN streaks s ON u.id = s.user_id
       WHERE u.id = $1 AND u.is_active = true`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;