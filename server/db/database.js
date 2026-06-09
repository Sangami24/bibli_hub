const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

let db = null;

let initPromise = null;

async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
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
    return db;
  })();

  return initPromise;
}

function getDb() {
  // Create an async proxy that mimics the old API but with Promises
  return {
    prepare(sql) {
      return {
        async run(...params) {
          await initDb();
          return await db.execute({ sql, args: params });
        },
        async get(...params) {
          await initDb();
          const res = await db.execute({ sql, args: params });
          if (res.rows.length > 0) {
            return res.rows[0];
          }
          return undefined;
        },
        async all(...params) {
          await initDb();
          const res = await db.execute({ sql, args: params });
          return res.rows;
        }
      };
    },
    async exec(sql) {
      await initDb();
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
