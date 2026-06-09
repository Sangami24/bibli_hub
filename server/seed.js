require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { initDb, getDb } = require('./db/database');
const { calculatePoints, estimatePrice } = require('./services/points');

const SEED_USER = {
  id: uuidv4(),
  email: 'library@biblihub.com',
  name: 'Bibli Hub Library',
  password_hash: 'not_applicable',
  points: 10000,
  avatar_url: 'https://ui-avatars.com/api/?name=Bibli+Library&background=10b981&color=fff'
};

const BOOKS_DATA = [
  // School Textbooks
  { title: "NCERT Physics Class 12 Part 1", author: "NCERT", category: "textbook", grade: "12", condition: "good" },
  { title: "NCERT Physics Class 12 Part 2", author: "NCERT", category: "textbook", grade: "12", condition: "like_new" },
  { title: "NCERT Mathematics Class 10", author: "NCERT", category: "textbook", grade: "10", condition: "fair" },
  { title: "Concepts of Physics Vol 1", author: "H.C. Verma", category: "textbook", grade: "11", condition: "good" },
  { title: "Concepts of Physics Vol 2", author: "H.C. Verma", category: "textbook", grade: "12", condition: "new" },
  { title: "RD Sharma Mathematics Class 11", author: "R.D. Sharma", category: "textbook", grade: "11", condition: "good" },
  { title: "NCERT Biology Class 11", author: "NCERT", category: "textbook", grade: "11", condition: "like_new" },
  
  // Competitive Exams
  { title: "Objective Mathematics for JEE Main", author: "R.D. Sharma", category: "competitive", condition: "good" },
  { title: "Problems in General Physics", author: "I.E. Irodov", category: "competitive", condition: "fair" },
  { title: "Quantitative Aptitude for Competitive Exams", author: "R.S. Aggarwal", category: "competitive", condition: "good" },
  { title: "Word Power Made Easy", author: "Norman Lewis", category: "competitive", condition: "like_new" },
  { title: "Manorama Yearbook 2023", author: "Mammen Mathew", category: "competitive", condition: "new" },

  // Fiction
  { title: "The Alchemist", author: "Paulo Coelho", category: "fiction", condition: "like_new" },
  { title: "The Kite Runner", author: "Khaled Hosseini", category: "fiction", condition: "good" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", category: "fiction", condition: "good" },
  { title: "1984", author: "George Orwell", category: "fiction", condition: "fair" },
  { title: "Pride and Prejudice", author: "Jane Austen", category: "fiction", condition: "good" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "fiction", condition: "like_new" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger", category: "fiction", condition: "good" },

  // Non-Fiction
  { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "non_fiction", condition: "good" },
  { title: "Atomic Habits", author: "James Clear", category: "non_fiction", condition: "new" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "non_fiction", condition: "like_new" },
  { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", category: "non_fiction", condition: "good" },
  { title: "The Psychology of Money", author: "Morgan Housel", category: "non_fiction", condition: "like_new" },

  // Children's Books
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "children", condition: "good" },
  { title: "Percy Jackson & The Olympians", author: "Rick Riordan", category: "children", condition: "fair" },
  { title: "Charlotte's Web", author: "E.B. White", category: "children", condition: "good" },
  { title: "Matilda", author: "Roald Dahl", category: "children", condition: "like_new" },
  { title: "The Very Hungry Caterpillar", author: "Eric Carle", category: "children", condition: "good" },

  // Comics & Reference
  { title: "Tintin in Tibet", author: "Hergé", category: "comics", condition: "fair" },
  { title: "Asterix and Cleopatra", author: "René Goscinny", category: "comics", condition: "good" },
  { title: "Oxford English Dictionary", author: "Oxford", category: "reference", condition: "good" },
];

async function runSeed() {
  try {
    console.log('🌱 Starting database seed...');
    await initDb();
    const db = getDb();

    // 1. Check if seed user exists
    let user = await db.prepare('SELECT id FROM users WHERE email = ?').get(SEED_USER.email);
    
    if (!user) {
      console.log('Creating library user...');
      await db.prepare(
        'INSERT INTO users (id, email, password_hash, name, points, avatar_url) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(SEED_USER.id, SEED_USER.email, SEED_USER.password_hash, SEED_USER.name, SEED_USER.points, SEED_USER.avatar_url);
      user = SEED_USER;
    }

    console.log(`Adding ${BOOKS_DATA.length} books...`);

    // 2. Insert books
    for (const book of BOOKS_DATA) {
      const bookId = uuidv4();
      const points = calculatePoints(book.category, book.condition);
      const price = estimatePrice(book.category, book.condition);
      
      await db.prepare(`
        INSERT INTO books (id, title, author, category, grade, condition, description, donated_by, points_value, estimated_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
      `).run(
        bookId, book.title, book.author, book.category, book.grade || null, 
        book.condition, 'A wonderful book available in the Bibli Hub library.', 
        user.id, points, price
      );
    }

    console.log('✅ Seed complete! Added 32 books to the database.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
