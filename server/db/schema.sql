-- Bibli Hub Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  google_id TEXT UNIQUE,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  grade TEXT,
  condition TEXT NOT NULL CHECK(condition IN ('new', 'like_new', 'good', 'fair')),
  description TEXT,
  cover_image TEXT,
  donated_by TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'picked_up', 'delivered')),
  points_value INTEGER DEFAULT 10,
  estimated_price INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT,
  pickup_state TEXT,
  pickup_pincode TEXT,
  pickup_phone TEXT,
  pickup_status TEXT DEFAULT 'pending' CHECK(pickup_status IN ('pending', 'scheduled', 'picked_up')),
  pickup_date DATETIME,
  estimated_pickup TEXT DEFAULT '3-5 business days',
  points_earned INTEGER DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  points_spent INTEGER NOT NULL,
  money_saved INTEGER DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT,
  delivery_state TEXT,
  delivery_pincode TEXT,
  delivery_phone TEXT,
  delivery_status TEXT DEFAULT 'processing' CHECK(delivery_status IN ('processing', 'shipped', 'delivered')),
  estimated_delivery_date TEXT,
  estimated_delivery_days INTEGER DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
