const db = require('./database');

console.log('\n--- SQLite `users` Table Contents ---');
db.all('SELECT id, username, name, password FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error querying database:', err.message);
  } else if (rows.length === 0) {
    console.log('The users table is currently empty.');
    console.log('Register a user first using POST /register in Postman!\n');
  } else {
    console.table(rows);
    console.log('\nNotice that the `password` field starts with $2b$ (bcrypt hash)');
    console.log('Plain-text passwords are never stored!\n');
  }
  db.close();
});
