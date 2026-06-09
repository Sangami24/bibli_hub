const { v4: uuidv4 } = require('uuid');
const { calculatePoints, estimatePrice } = require('../services/points');

// Fake user IDs for sample donors
const DONOR_IDS = [
  'seed-user-001', 'seed-user-002', 'seed-user-003',
  'seed-user-004', 'seed-user-005', 'seed-user-006',
  'seed-user-007', 'seed-user-008',
];

const DONOR_NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Ananya Singh',
  'Vikram Reddy', 'Sneha Joshi', 'Arjun Nair', 'Kavya Iyer',
];

const SAMPLE_BOOKS = [
  // Competitive Exam Prep
  { title: 'Concepts of Physics Vol 1', author: 'H.C. Verma', category: 'competitive', condition: 'good', description: 'Classic physics book for JEE preparation. Solved examples and exercises.' },
  { title: 'Concepts of Physics Vol 2', author: 'H.C. Verma', category: 'competitive', condition: 'like_new', description: 'Volume 2 covering optics, modern physics, and more.' },
  { title: 'Organic Chemistry (Morrison & Boyd)', author: 'Robert Morrison', category: 'competitive', condition: 'good', description: 'Comprehensive organic chemistry reference for IIT-JEE.' },
  { title: 'Problems in General Physics', author: 'I.E. Irodov', category: 'competitive', condition: 'fair', description: 'Advanced physics problems, great for Olympiad prep.' },
  { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', category: 'competitive', condition: 'good', description: 'Essential for CAT, Bank PO, and SSC exams.' },
  { title: 'Word Power Made Easy', author: 'Norman Lewis', category: 'competitive', condition: 'like_new', description: 'The best vocabulary builder for competitive exams.' },

  // School Textbooks
  { title: 'NCERT Mathematics Class 10', author: 'NCERT', category: 'textbook', grade: '10', condition: 'good', description: 'CBSE Class 10 Mathematics textbook. All chapters intact.' },
  { title: 'NCERT Science Class 10', author: 'NCERT', category: 'textbook', grade: '10', condition: 'like_new', description: 'Barely used, clean pages. Perfect for next year students.' },
  { title: 'NCERT Physics Class 12 (Part 1)', author: 'NCERT', category: 'textbook', grade: '12', condition: 'good', description: 'Electrostatics to current electricity. Some highlighting.' },
  { title: 'NCERT Chemistry Class 12', author: 'NCERT', category: 'textbook', grade: '12', condition: 'fair', description: 'All chapters present. Some wear on cover.' },
  { title: 'NCERT Biology Class 11', author: 'NCERT', category: 'textbook', grade: '11', condition: 'new', description: 'Brand new, never used. Bought extra copy by mistake.' },
  { title: 'R.D. Sharma Mathematics Class 12', author: 'R.D. Sharma', category: 'textbook', grade: '12', condition: 'good', description: 'Excellent for board exam preparation with solved examples.' },
  { title: 'NCERT History Class 9', author: 'NCERT', category: 'textbook', grade: '9', condition: 'like_new', description: 'India and the Contemporary World. Clean condition.' },

  // Fiction / Novels
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'fiction', condition: 'like_new', description: 'A beautiful story about following your dreams. Paperback edition.' },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', category: 'fiction', condition: 'good', description: 'The book that started it all! Bloomsbury edition.' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'fiction', condition: 'good', description: 'Pulitzer Prize winner. A timeless classic.' },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', category: 'fiction', condition: 'like_new', description: 'A powerful story of friendship and redemption.' },
  { title: '1984', author: 'George Orwell', category: 'fiction', condition: 'fair', description: 'Dystopian masterpiece. Penguin Classics edition.' },
  { title: 'The God of Small Things', author: 'Arundhati Roy', category: 'fiction', condition: 'good', description: 'Booker Prize winner. Set in Kerala.' },
  { title: 'A Suitable Boy', author: 'Vikram Seth', category: 'fiction', condition: 'like_new', description: 'Epic Indian novel. Hardcover edition, 1,349 pages.' },

  // Non-Fiction
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', category: 'non_fiction', condition: 'like_new', description: 'Mind-blowing perspective on human history.' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'non_fiction', condition: 'new', description: 'Never read. Great book on building good habits.' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'non_fiction', condition: 'good', description: 'Timeless lessons on wealth, greed, and happiness.' },
  { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'non_fiction', condition: 'good', description: 'Autobiography of India\'s Missile Man. Inspirational read.' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'non_fiction', condition: 'fair', description: 'Nobel Prize winner on decision-making and cognitive biases.' },

  // Reference & GK
  { title: 'Manorama Yearbook 2025', author: 'Malayala Manorama', category: 'reference', condition: 'like_new', description: 'Comprehensive yearbook for GK and current affairs.' },
  { title: 'Lucent\'s General Knowledge', author: 'Lucent Publications', category: 'reference', condition: 'good', description: 'The go-to GK book for all competitive exams.' },
  { title: 'Oxford English Dictionary (Compact)', author: 'Oxford', category: 'reference', condition: 'good', description: 'Compact edition. Great for students and writers.' },

  // Children's Books
  { title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', category: 'children', condition: 'good', description: 'Hilarious illustrated novel for kids 8-12.' },
  { title: 'Charlie and the Chocolate Factory', author: 'Roald Dahl', category: 'children', condition: 'like_new', description: 'Classic Roald Dahl. Puffin edition with illustrations.' },
  { title: 'The Adventures of Tintin: The Blue Lotus', author: 'Hergé', category: 'children', condition: 'good', description: 'Beautiful comic album. Hardcover.' },
  { title: 'Panchatantra Stories', author: 'Vishnu Sharma', category: 'children', condition: 'new', description: 'Collection of ancient Indian fables. Illustrated edition.' },

  // Comics & Graphic Novels
  { title: 'Maus: A Survivor\'s Tale', author: 'Art Spiegelman', category: 'comics', condition: 'like_new', description: 'Pulitzer Prize-winning graphic novel about the Holocaust.' },
  { title: 'Persepolis', author: 'Marjane Satrapi', category: 'comics', condition: 'good', description: 'Autobiographical graphic novel set in Iran.' },
  { title: 'Amar Chitra Katha: Mahabharata', author: 'Anant Pai', category: 'comics', condition: 'fair', description: 'Classic Indian comic series. 3-volume set.' },

  // Other
  { title: 'The Joy of Cooking', author: 'Irma S. Rombauer', category: 'other', condition: 'good', description: 'Comprehensive cookbook with 4,500+ recipes.' },
  { title: 'Drawing on the Right Side of the Brain', author: 'Betty Edwards', category: 'other', condition: 'like_new', description: 'Learn to draw like an artist. 4th edition.' },
];

function seedDatabase(db) {
  // Check if we already have seed data
  const existingBooks = db.prepare('SELECT COUNT(*) as count FROM books').get();
  if (existingBooks && existingBooks.count > 0) {
    console.log('📚 Database already has data, skipping seed.');
    return;
  }

  console.log('🌱 Seeding database with sample data...');

  // Create seed donor users
  const insertUser = db.prepare(
    'INSERT OR IGNORE INTO users (id, email, name, points, created_at) VALUES (?, ?, ?, ?, ?)'
  );

  DONOR_IDS.forEach((id, i) => {
    const daysAgo = Math.floor(Math.random() * 90) + 10;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    insertUser.run(id, `${DONOR_NAMES[i].toLowerCase().replace(' ', '.')}@email.com`, DONOR_NAMES[i], Math.floor(Math.random() * 80) + 20, createdAt);
  });

  // Insert books
  const insertBook = db.prepare(
    'INSERT INTO books (id, title, author, category, grade, condition, description, donated_by, points_value, estimated_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertDonation = db.prepare(
    'INSERT INTO donations (id, user_id, book_id, pickup_address, pickup_city, pickup_status, points_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Jaipur'];

  SAMPLE_BOOKS.forEach((book, i) => {
    const bookId = uuidv4();
    const donorIndex = i % DONOR_IDS.length;
    const donorId = DONOR_IDS[donorIndex];
    const points = calculatePoints(book.category, book.condition);
    const price = estimatePrice(book.category, book.condition);
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

    insertBook.run(
      bookId, book.title, book.author, book.category,
      book.grade || null, book.condition, book.description,
      donorId, points, price, 'available', createdAt
    );

    insertDonation.run(
      uuidv4(), donorId, bookId,
      `${Math.floor(Math.random() * 500) + 1}, Sample Street`,
      cities[donorIndex],
      'picked_up', points, createdAt
    );
  });

  console.log(`✅ Seeded ${SAMPLE_BOOKS.length} books from ${DONOR_IDS.length} donors`);
}

module.exports = { seedDatabase };
