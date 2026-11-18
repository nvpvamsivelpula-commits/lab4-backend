const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/database');

// Secret key for signing JWT tokens (constant for this lab)
const JWT_SECRET = 'COLLEGE_LAB_SECRET_KEY';

/**
 * @route   POST /register
 * @desc    Register a new user
 */
router.post('/register', async (req, res) => {
  const { username, name, password } = req.body;

  // 1. Validate required fields
  if (!username || !name || !password) {
    return res.status(400).json({
      error: 'All fields (username, name, password) are required.'
    });
  }

  // 2. Check whether username already exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.get(checkUserQuery, [username], async (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while checking username.' });
    }

    if (existingUser) {
      // 3. Return HTTP 400 if username already exists
      return res.status(400).json({ error: 'Username already exists.' });
    }

    try {
      // 4. Hash the password using bcrypt.hash()
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 5. Insert user into SQLite using parameterized query
      const insertUserQuery = 'INSERT INTO users (username, name, password) VALUES (?, ?, ?)';
      db.run(insertUserQuery, [username, name, hashedPassword], function (insertErr) {
        if (insertErr) {
          return res.status(500).json({ error: 'Database error occurred during registration.' });
        }

        // 6. Return a success message (never return password or hash)
        return res.status(201).json({
          message: 'User registered successfully.'
        });
      });
    } catch (hashError) {
      return res.status(500).json({ error: 'Error hashing password.' });
    }
  });
});

/**
 * @route   POST /login
 * @desc    Authenticate existing user and return JWT
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required.'
    });
  }

  // 1. Find user using username
  const findUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.get(findUserQuery, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred during login.' });
    }

    // 2. Return HTTP 400 if username does not exist
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or user does not exist.' });
    }

    try {
      // 3. Verify password using bcrypt.compare()
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      // 4. Return HTTP 400 if password is incorrect
      if (!isPasswordMatch) {
        return res.status(400).json({ error: 'Invalid password.' });
      }

      // 5. Generate JWT with ONLY username in payload
      const payload = {
        username: user.username
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      // 8. Return response in specified format
      return res.status(200).json({
        jwt_token: token
      });
    } catch (compareError) {
      return res.status(500).json({ error: 'Error verifying password.' });
    }
  });
});

module.exports = router;
