require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function applySchema() {
  try {
    console.log('Applying schema...');
    let sql = fs.readFileSync('schema.sql', 'utf8');
    sql = sql.replace(/^\uFEFF/, '');
    await pool.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    await pool.end();
  }
}

applySchema();
