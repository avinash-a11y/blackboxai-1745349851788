const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create donors table if not exists
const createDonorsTable = `
CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Create receivers table if not exists
const createReceiversTable = `
CREATE TABLE IF NOT EXISTS receivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Initialize tables
async function initTables() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(createDonorsTable);
    await conn.query(createReceiversTable);
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    if (conn) conn.release();
  }
}

initTables();

// API endpoints

// Add donor
app.post('/api/donors', async (req, res) => {
  const { name, email, phone, blood_group, city } = req.body;
  if (!name || !email || !phone || !blood_group || !city) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO donors (name, email, phone, blood_group, city) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, blood_group, city]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, blood_group, city });
  } catch (err) {
    console.error('Error adding donor:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Get all donors
app.get('/api/donors', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM donors ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Add receiver
app.post('/api/receivers', async (req, res) => {
  const { name, email, phone, blood_group, city } = req.body;
  if (!name || !email || !phone || !blood_group || !city) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO receivers (name, email, phone, blood_group, city) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, blood_group, city]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, blood_group, city });
  } catch (err) {
    console.error('Error adding receiver:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Get all receivers
app.get('/api/receivers', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM receivers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching receivers:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Get blood group distribution for donors
app.get('/api/donors/blood-group-distribution', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT blood_group, COUNT(*) as count FROM donors GROUP BY blood_group'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching donor blood group distribution:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Get blood group distribution for receivers
app.get('/api/receivers/blood-group-distribution', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT blood_group, COUNT(*) as count FROM receivers GROUP BY blood_group'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching receiver blood group distribution:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
