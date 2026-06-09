const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

let db = null;

async function initDb() {
  if (db) return db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  }

  db = createClient({
    url,
    authToken,
  });

  // Run schema
  const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
  const schemaStr = fs.readFileSync(SCHEMA_PATH, 'utf8');
  
  // Basic split by semicolon to run statements (simple schema handling)
  const statements = schemaStr.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    try {
      await db.execute(stmt);
    } catch (e) {
      console.error('Schema init error for stmt:', stmt, e);
    }
  }

  console.log('✅ Connected to Turso Cloud Database');
  
  // Seed basic data if users table is empty
  try {
    const res = await db.execute('SELECT COUNT(*) as count FROM users');
    if (res.rows[0].count === 0) {
      const { seedDatabase } = require('./seed');
      // seed database expects synchronous proxy, we might need to skip seed or update seed.js
      console.log('Skipping seed for cloud db to avoid sync issues. Create users via app.');
    }
  } catch (e) {
    console.error('Seed check error:', e);
  }

  return getDb();
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }

  // Create an async proxy that mimics the old API but with Promises
  return {
    prepare(sql) {
      return {
        async run(...params) {
          return await db.execute({ sql, args: params });
        },
        async get(...params) {
          const res = await db.execute({ sql, args: params });
          if (res.rows.length > 0) {
            // Convert array row to object if necessary, but libsql returns objects for rows
            return res.rows[0];
          }
          return undefined;
        },
        async all(...params) {
          const res = await db.execute({ sql, args: params });
          return res.rows;
        }
      };
    },
    async exec(sql) {
      return await db.execute(sql);
    }
  };
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

function saveDb() {
  // No-op for Turso
}

module.exports = { initDb, getDb, closeDb, saveDb };
