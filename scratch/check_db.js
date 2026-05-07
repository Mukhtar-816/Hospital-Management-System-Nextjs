const { Pool } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL="?([^"\s]+)"?/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : null;

if (!dbUrl) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });

async function check() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_name IN ('users', 'doctor', 'patient', 'receptionist', 'appointment', 'appointmentrequest', 'interaction')
      ORDER BY table_name, ordinal_position;
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
