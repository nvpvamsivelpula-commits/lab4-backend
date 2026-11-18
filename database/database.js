const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Resolve path to SQLite database file inside database folder
const dbPath = path.resolve(__dirname, 'users.db');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Automatically create the users table when initialized
const initDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table initialized successfully.');
    }
  });
};

initDatabase();

module.exports = db;
