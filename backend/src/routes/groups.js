import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/', authenticate, [
  body('name').isLength({ min: 3, max: 100 }).trim(),
  body('description').optional().isLength({ max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const invite_code = generateInviteCode();

    const result = await query(
      'INSERT INTO groups (owner_user_id, name, invite_code, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, invite_code, description || null]
    );

    const group = result.rows[0];

    await query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [group.id, req.user.id, 'owner']
    );

    res.status(201).json({
      message: 'Group created',
      group: {
        id: group.id,
        name: group.name,
        invite_code: group.invite_code,
        description: group.description
      }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.post('/join', authenticate, [
  body('invite_code').isLength({ min: 6, max: 20 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { invite_code } = req.body;

    const group = await query(
      'SELECT id, name FROM groups WHERE invite_code = $1',
      [invite_code.toUpperCase()]
    );

    if (group.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    const groupId = group.rows[0].id;

    const existing = await query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    await query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [groupId, req.user.id, 'member']
    );

    res.json({ message: 'Joined group successfully', group: group.rows[0] });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT g.id, g.name, g.description, g.invite_code, g.created_at,
              u.username as owner_username
       FROM groups g
       JOIN users u ON g.owner_user_id = u.id
       WHERE g.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group: result.rows[0] });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to get group' });
  }
});

router.get('/:id/members', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT gm.role, gm.joined_at,
              u.id, u.username, u.display_name, u.favorite_team
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [req.params.id]
    );

    res.json({ members: result.rows });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
});

router.get('/my/list', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT g.id, g.name, g.description, g.invite_code, gm.role,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY gm.joined_at DESC`,
      [req.user.id]
    );

    res.json({ groups: result.rows });
  } catch (error) {
    console.error('Get my groups error:', error);
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

export default router;