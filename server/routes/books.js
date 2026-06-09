const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { calculatePoints, estimatePrice, getEstimatedDeliveryDate, POINTS_MAP } = require('../services/points');

const router = express.Router();

// GET /api/books - Browse available books
router.get('/', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const { category, search, grade, condition, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT b.*, u.name as donor_name
      FROM books b
      JOIN users u ON b.donated_by = u.id
      WHERE b.status = 'available'
    `;
    const params = [];

    if (category) {
      query += ' AND b.category = ?';
      params.push(category);
    }

    if (grade) {
      query += ' AND b.grade = ?';
      params.push(grade);
    }

    if (condition) {
      query += ' AND b.condition = ?';
      params.push(condition);
    }

    if (search) {
      query += ' AND (b.title LIKE ? OR b.author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = query.replace('SELECT b.*, u.name as donor_name', 'SELECT COUNT(*) as total');
    const { total } = await db.prepare(countQuery).get(...params);

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const books = await db.prepare(query).all(...params);

    res.json({
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Browse books error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/books/categories - Get all categories
router.get('/categories', async (req, res) => {
  const categories = [
    { id: 'textbook', label: 'School Textbooks', icon: '📖' },
    { id: 'fiction', label: 'Fiction & Novels', icon: '📚' },
    { id: 'non_fiction', label: 'Non-Fiction', icon: '📘' },
    { id: 'competitive', label: 'Competitive Exam Prep', icon: '🎯' },
    { id: 'reference', label: 'Reference & GK', icon: '🔍' },
    { id: 'children', label: "Children's Books", icon: '🧒' },
    { id: 'comics', label: 'Comics & Graphic Novels', icon: '💥' },
    { id: 'other', label: 'Other', icon: '📦' },
  ];
  res.json({ categories });
});

// GET /api/books/points-table - Get points calculation table
router.get('/points-table', async (req, res) => {
  res.json({ pointsTable: POINTS_MAP });
});

// GET /api/books/:id - Get single book details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = getDb();
    const book = await db.prepare(`
      SELECT b.*, u.name as donor_name, u.avatar_url as donor_avatar
      FROM books b
      JOIN users u ON b.donated_by = u.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Add delivery estimate
    const delivery = getEstimatedDeliveryDate();
    book.estimated_delivery_days = delivery.days;
    book.estimated_delivery_date = delivery.date;

    res.json({ book });
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/books/donate - Donate a book
router.post('/donate', authMiddleware, async (req, res) => {
  try {
    const {
      title, author, category, grade, condition, description,
      pickup_address, pickup_city, pickup_state, pickup_pincode, pickup_phone
    } = req.body;

    if (!title || !author || !category || !condition) {
      return res.status(400).json({ error: 'Title, author, category, and condition are required.' });
    }

    if (!pickup_address) {
      return res.status(400).json({ error: 'Pickup address is required.' });
    }

    const db = getDb();
    const bookId = uuidv4();
    const donationId = uuidv4();

    // Calculate points based on category and condition
    const pointsValue = calculatePoints(category, condition);
    const estimatedPrice = estimatePrice(category, condition);

    // Create book record
    await db.prepare(`
      INSERT INTO books (id, title, author, category, grade, condition, description, donated_by, points_value, estimated_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
    `).run(bookId, title, author, category, grade || null, condition, description || '', req.user.id, pointsValue, estimatedPrice);

    // Create donation/pickup record
    await db.prepare(`
      INSERT INTO donations (id, user_id, book_id, pickup_address, pickup_city, pickup_state, pickup_pincode, pickup_phone, points_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(donationId, req.user.id, bookId, pickup_address, pickup_city || '', pickup_state || '', pickup_pincode || '', pickup_phone || '', pointsValue);

    // Award points to user
    await db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pointsValue, req.user.id);

    const updatedUser = await db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
    const book = await db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    const donation = await db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId);

    res.status(201).json({
      message: `Book donated successfully! You earned ${pointsValue} points.`,
      book,
      donation,
      newPoints: updatedUser.points,
    });
  } catch (err) {
    console.error('Donate book error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/books/:id/claim - Claim a book using points
router.post('/:id/claim', authMiddleware, async (req, res) => {
  try {
    const { delivery_address, delivery_city, delivery_state, delivery_pincode, delivery_phone } = req.body;

    if (!delivery_address) {
      return res.status(400).json({ error: 'Delivery address is required.' });
    }

    const db = getDb();
    const book = await db.prepare('SELECT * FROM books WHERE id = ? AND status = ?').get(req.params.id, 'available');

    if (!book) {
      return res.status(404).json({ error: 'Book not found or already claimed.' });
    }

    if (book.donated_by === req.user.id) {
      return res.status(400).json({ error: 'You cannot claim your own donated book.' });
    }

    const user = await db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
    if (user.points < book.points_value) {
      return res.status(400).json({
        error: `Insufficient points. You have ${user.points} points but need ${book.points_value}.`,
      });
    }

    const orderId = uuidv4();
    const delivery = getEstimatedDeliveryDate();

    // Create order with delivery estimate and money saved
    await db.prepare(`
      INSERT INTO orders (id, user_id, book_id, points_spent, money_saved, delivery_address, delivery_city, delivery_state, delivery_pincode, delivery_phone, estimated_delivery_date, estimated_delivery_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(orderId, req.user.id, book.id, book.points_value, book.estimated_price, delivery_address, delivery_city || '', delivery_state || '', delivery_pincode || '', delivery_phone || '', delivery.date, delivery.days);

    // Update book status
    await db.prepare('UPDATE books SET status = ? WHERE id = ?').run('claimed', book.id);

    // Deduct points
    await db.prepare('UPDATE users SET points = points - ? WHERE id = ?').run(book.points_value, req.user.id);

    const updatedUser = await db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    res.status(201).json({
      message: `Book claimed! It will arrive by ${delivery.date} (${delivery.days} days). You saved ₹${book.estimated_price}!`,
      order,
      newPoints: updatedUser.points,
      moneySaved: book.estimated_price,
      estimatedDelivery: delivery,
    });
  } catch (err) {
    console.error('Claim book error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
