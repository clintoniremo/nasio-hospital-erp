const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function run() {
  const sqlPath = path.resolve(__dirname, '..', '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' });

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not set in server/.env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  try {
    console.log('Applying schema...');
    await pool.query(sql);
    console.log('Schema applied successfully');
  } catch (err) {
    console.error('Error applying schema:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
}

run();
