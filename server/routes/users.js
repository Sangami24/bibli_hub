const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile - Get full profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const user = await db.prepare(
      'SELECT id, email, name, phone, address_line1, address_line2, city, state, pincode, avatar_url, points, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get stats
    const donationCount = await db.prepare('SELECT COUNT(*) as count FROM donations WHERE user_id = ?').get(req.user.id).count;
    const orderCount = await db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').get(req.user.id).count;
    const totalPointsEarned = await db.prepare('SELECT COALESCE(SUM(points_earned), 0) as total FROM donations WHERE user_id = ?').get(req.user.id).total;
    const moneySaved = await db.prepare('SELECT COALESCE(SUM(money_saved), 0) as total FROM orders WHERE user_id = ?').get(req.user.id).total;

    res.json({
      user,
      stats: {
        booksDonated: donationCount,
        booksClaimed: orderCount,
        totalPointsEarned,
        moneySaved,
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/users/profile - Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address_line1, address_line2, city, state, pincode } = req.body;

    const db = getDb();
    await db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        address_line1 = COALESCE(?, address_line1),
        address_line2 = COALESCE(?, address_line2),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        pincode = COALESCE(?, pincode)
      WHERE id = ?
    `).run(name, phone, address_line1, address_line2, city, state, pincode, req.user.id);

    const user = await db.prepare(
      'SELECT id, email, name, phone, address_line1, address_line2, city, state, pincode, avatar_url, points, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    res.json({ user, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/users/donations - Get user's donation history
router.get('/donations', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const donations = await db.prepare(`
      SELECT d.*, b.title, b.author, b.category, b.condition, b.cover_image, b.status as book_status
      FROM donations d
      JOIN books b ON d.book_id = b.id
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC
    `).all(req.user.id);

    res.json({ donations });
  } catch (err) {
    console.error('Get donations error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/users/orders - Get user's order history
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const orders = await db.prepare(`
      SELECT o.*, b.title, b.author, b.category, b.condition, b.cover_image, u.name as donor_name
      FROM orders o
      JOIN books b ON o.book_id = b.id
      JOIN users u ON b.donated_by = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);

    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/users/stats - Get platform stats (public)
router.get('/stats', async (req, res) => {
  try {
    // Return realistic numbers as requested
    res.json({
      stats: {
        totalExchanges: 2847,
        totalUsers: 1203,
        treesSaved: 85,
        moneySaved: 423500,
      },
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
