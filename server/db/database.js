const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'biblihub.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;
let dbReady = null;

function initDb() {
  if (dbReady) return dbReady;

  dbReady = initSqlJs().then((SQL) => {
    // Load existing database or create new one
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Run schema
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.run(schema);

    // Auto-save to disk periodically
    setInterval(() => saveDb(), 10000);

    console.log('✅ Database initialized successfully');

    // Run seed data
    const { seedDatabase } = require('./seed');
    seedDatabase(createDbProxy(db));

    return db;
  });

  return dbReady;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return createDbProxy(db);
}

function saveDb() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (e) {
      // Ignore save errors during shutdown
    }
  }
}

function closeDb() {
  if (db) {
    saveDb();
    db.close();
    db = null;
    dbReady = null;
  }
}

// Create a proxy that mimics better-sqlite3 API for compatibility
function createDbProxy(sqlDb) {
  return {
    prepare(sql) {
      return {
        run(...params) {
          sqlDb.run(sql, params);
          saveDb();
        },
        get(...params) {
          const stmt = sqlDb.prepare(sql);
          if (params.length > 0) stmt.bind(params);
          if (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            stmt.free();
            const result = {};
            columns.forEach((col, i) => { result[col] = values[i]; });
            return result;
          }
          stmt.free();
          return undefined;
        },
        all(...params) {
          const results = [];
          const stmt = sqlDb.prepare(sql);
          if (params.length > 0) stmt.bind(params);
          while (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            const row = {};
            columns.forEach((col, i) => { row[col] = values[i]; });
            results.push(row);
          }
          stmt.free();
          return results;
        },
      };
    },
    exec(sql) {
      sqlDb.run(sql);
      saveDb();
    },
    pragma(str) {
      try {
        sqlDb.run(`PRAGMA ${str}`);
      } catch (e) {
        // Ignore pragma errors
      }
    },
  };
}

module.exports = { initDb, getDb, closeDb, saveDb };
