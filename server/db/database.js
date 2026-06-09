const fs = require('fs');
const path = require('path');

let initPromise = null;

async function executeTurso(sql, args = []) {
  let url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error('TURSO_DATABASE_URL is missing');
  url = url.replace('libsql://', 'https://');
  const token = process.env.TURSO_AUTH_TOKEN;

  // Convert args to Hrana format
  const hranaArgs = args.map(arg => {
    if (arg === null || arg === undefined) return { type: 'null' };
    if (typeof arg === 'number') {
      if (Number.isInteger(arg)) return { type: 'integer', value: '' + arg };
      return { type: 'float', value: arg };
    }
    return { type: 'text', value: String(arg) };
  });

  const body = {
    requests: [
      { type: 'execute', stmt: { sql, args: hranaArgs } },
      { type: 'close' }
    ]
  };

  const res = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Turso HTTP Error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const resultObj = data.results[0];

  if (resultObj.type === 'error') {
    throw new Error(`Turso SQL Error: ${resultObj.error.message}`);
  }

  const result = resultObj.response.result;
  if (!result || !result.cols) return { rows: [] };

  const columns = result.cols.map(c => c.name);
  const rows = result.rows.map(rowVals => {
    const rowObj = {};
    columns.forEach((col, i) => {
      const valObj = rowVals[i];
      let val = valObj.value;
      if (valObj.type === 'null') val = null;
      else if (valObj.type === 'integer') val = parseInt(valObj.value, 10);
      else if (valObj.type === 'float') val = parseFloat(valObj.value);
      rowObj[col] = val;
    });
    return rowObj;
  });

  return { rows };
}

async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log('✅ Initializing Turso Cloud Database via Native Fetch');

    // Run schema
    const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaStr = fs.readFileSync(SCHEMA_PATH, 'utf8');
      const cleanSchema = schemaStr.replace(/--.*$/gm, '').trim();
      const statements = cleanSchema.split(';').map(s => s.trim()).filter(s => s.length > 0);
      
      for (const stmt of statements) {
        try {
          await executeTurso(stmt);
        } catch (e) {
          console.error('Schema init error for stmt:', stmt, e.message);
        }
      }
    }
    return true;
  })();

  return initPromise;
}

function getDb() {
  return {
    prepare(sql) {
      return {
        async run(...params) {
          await initDb();
          return await executeTurso(sql, params);
        },
        async get(...params) {
          await initDb();
          const res = await executeTurso(sql, params);
          if (res.rows.length > 0) {
            return res.rows[0];
          }
          return undefined;
        },
        async all(...params) {
          await initDb();
          const res = await executeTurso(sql, params);
          return res.rows;
        }
      };
    },
    async exec(sql) {
      await initDb();
      return await executeTurso(sql);
    }
  };
}

function closeDb() {}
function saveDb() {}

module.exports = { initDb, getDb, closeDb, saveDb };
