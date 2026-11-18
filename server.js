const express = require('express');
const db = require('./database/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/', authRoutes);

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    message: 'Lab 4 Authentication API is running.',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      viewDatabase: 'GET /view-database'
    }
  });
});

// Browser viewer to see database records and bcrypt hashes
app.get('/view-database', (req, res) => {
  db.all('SELECT id, username, name, password FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error reading database.');
    }
    const tableRows = rows.map(r => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${r.id}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${r.username}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${r.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace; word-break: break-all; color: #d63384;">${r.password}</td>
      </tr>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lab 4 - SQLite Database Viewer</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; background-color: #f8f9fa; }
          .container { max-width: 950px; margin: 0 auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h2 { color: #333; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background-color: #007bff; color: white; padding: 12px; text-align: left; }
          .badge { display: inline-block; background: #e8f4fd; color: #007bff; padding: 6px 12px; border-radius: 4px; font-size: 13px; margin-bottom: 10px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Lab 4: SQLite Database Viewer</h2>
          <div class="badge">Table: users (Total Records: ${rows.length})</div>
          <table>
            <thead>
              <tr>
                <th style="width: 50px;">ID</th>
                <th style="width: 150px;">Username</th>
                <th style="width: 150px;">Name</th>
                <th>Password (bcrypt hash)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="4" style="text-align:center; padding:20px;">No users registered yet.</td></tr>'}
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #555; font-size: 14px;">
            <strong>Security Verification:</strong> Passwords begin with <code>$2b$10$</code> indicating a 10-round salted bcrypt hash. Plain-text passwords are never stored.
          </p>
        </div>
      </body>
      </html>
    `);
  });
});

// Start Express server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
