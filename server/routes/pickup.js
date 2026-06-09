const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/pickup - Get user's pickup requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const pickups = await db.prepare(`
      SELECT d.*, b.title, b.author, b.category
      FROM donations d
      JOIN books b ON d.book_id = b.id
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC
    `).all(req.user.id);

    res.json({ pickups });
  } catch (err) {
    console.error('Get pickups error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/pickup/:id - Get single pickup details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const pickup = await db.prepare(`
      SELECT d.*, b.title, b.author, b.category, b.condition
      FROM donations d
      JOIN books b ON d.book_id = b.id
      WHERE d.id = ? AND d.user_id = ?
    `).get(req.params.id, req.user.id);

    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found.' });
    }

    res.json({ pickup });
  } catch (err) {
    console.error('Get pickup error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
