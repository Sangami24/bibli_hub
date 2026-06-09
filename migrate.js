const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'server', 'routes');
const files = ['auth.js', 'books.js', 'pickup.js', 'users.js'];

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Make route handlers async if they aren't already
  content = content.replace(/router\.(get|post|put|delete|patch)\(([^,]+),\s*(authMiddleware|optionalAuth)?\s*,?\s*\(req,\s*res\)\s*=>\s*\{/g, (match, method, route, middleware) => {
    if (middleware) {
      return `router.${method}(${route}, ${middleware}, async (req, res) => {`;
    }
    return `router.${method}(${route}, async (req, res) => {`;
  });

  // Handle (req, res, next) just in case
  content = content.replace(/router\.(get|post|put|delete|patch)\(([^,]+),\s*\(req,\s*res,\s*next\)\s*=>\s*\{/g, 'router.$1($2, async (req, res, next) => {');

  // Replace all db.prepare( with await db.prepare(
  content = content.replace(/(?<!await\s+)db\.prepare/g, 'await db.prepare');
  
  // Save file
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

// Update package.json
const packageJsonPath = path.join(__dirname, 'server', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.dependencies['@libsql/client'] = '^0.6.0';
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log('Updated package.json');
}

// Update .env
const envPath = path.join(__dirname, 'server', '.env');
const envContent = `\nTURSO_DATABASE_URL=libsql://bibihib-sangami24.aws-ap-south-1.turso.io\nTURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA5ODY1MTYsImlkIjoiMDE5ZWFiMGUtZDAwMS03Njc2LWEyYWQtMzBiMzAzODk1ZDE3IiwicmlkIjoiYzJhNWUwNDctOTBjMC00MGY4LThmMGMtZmFkNWZlMGM3MjA4In0.EqhUseWKg1IPRpMM4tj1U9FayDFG18b8MNhUqiKtLUiHXLr5Ox9LGhTSMahCDUgYqq4ocMzB7B3B1ImH1Hm9AQ\n`;
if (fs.existsSync(envPath)) {
  const currentEnv = fs.readFileSync(envPath, 'utf8');
  if (!currentEnv.includes('TURSO_DATABASE_URL')) {
    fs.appendFileSync(envPath, envContent);
    console.log('Updated .env');
  }
}

console.log('Migration script complete!');
