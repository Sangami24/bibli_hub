require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, closeDb } = require('./db/database');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const pickupRoutes = require('./routes/pickup');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pickup', pickupRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bibli Hub API is running 📚' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});

// Initialize DB then start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Bibli Hub API running on http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});
