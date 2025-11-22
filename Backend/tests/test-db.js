import pool from "../models/db.js";

//Query databse connection and return tables made
async function testConnection() {
  try {
    const res = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    console.log("✅ Connected successfully!");
    console.log("Tables in your database:");
    console.table(res.rows);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
