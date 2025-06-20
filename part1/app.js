var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var fs = require('fs');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    const sqlFile = fs.readFileSync(
        path.json(__dirname, "dogwalks.sql",
            'utf8'
        )
    )

    // Create the database if it doesn't exist
    await connection.query(sqlFile);
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('zzz', 'zzz@example.com', 'hashed110', 'owner'),
        ('fff', 'fff@example.com', 'hashed120', 'walker')
    `)


    } catch (err) {
     console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
})();

// Route to return books as JSON
app.get('/', async (req, res) => {
  try {
    const [books] = await db.execute('SELECT * FROM books');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// /api/dogs
app.get('/api/dogs', async(req, res) => {
    try {
        const [rows] = await.db.execute(`
            SELECT d.name AS dog_name, d.size, u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id
        `);
        res.json(rows);

    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });

});

module.exports = app;