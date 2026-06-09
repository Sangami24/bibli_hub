require('dotenv').config();
const { initDb, getDb } = require('./db/database');

async function fetchCover(title) {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=3`);
    const data = await res.json();
    for (const doc of data.docs) {
      if (doc.cover_i) {
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      }
    }
  } catch(e) {}
  return null;
}

async function run() {
  try {
    console.log('📚 Initializing Cover Updater...');
    await initDb();
    const db = getDb();
    const books = await db.prepare('SELECT id, title FROM books WHERE cover_image IS NULL').all();
    
    if (books.length === 0) {
      console.log('All books already have covers!');
      process.exit(0);
    }

    console.log(`Found ${books.length} books without covers. Searching OpenLibrary...`);
    let count = 0;
    
    for (const book of books) {
      process.stdout.write(`Searching cover for "${book.title}"... `);
      const coverUrl = await fetchCover(book.title);
      
      if (coverUrl) {
        await db.prepare('UPDATE books SET cover_image = ? WHERE id = ?').run(coverUrl, book.id);
        console.log(`✅ Found!`);
        count++;
      } else {
        // Create a beautiful custom placeholder for books without a real cover
        const text = encodeURIComponent(book.title.split(' ').slice(0, 3).join(' ')); // Max 3 words to fit
        const fallback = `https://placehold.co/400x600/e2e8f0/1e293b?text=${text}`;
        await db.prepare('UPDATE books SET cover_image = ? WHERE id = ?').run(fallback, book.id);
        console.log(`❌ Not found, using custom placeholder.`);
      }
    }
    
    console.log(`\n✨ Done! Beautiful covers added to all ${books.length} books!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update covers:', error);
    process.exit(1);
  }
}

run();
