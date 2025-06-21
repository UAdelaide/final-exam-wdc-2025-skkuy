const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');
const db = require('./models/db'); // ADD THIS LINE - Import the database

// Session middleware - added for login authentication
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// FIX THE /api/dogs ENDPOINT
app.get('/api/dogs', async (req, res) => {
    try {
        // Change db.execute() to db.query() to match your other routes
        const [rows] = await db.query(`
            SELECT d.name AS dog_name, d.size, u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id
            ORDER BY d.name
        `);
        console.log('Dogs query result:', rows); // Debug log
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Failed to fetch dogs', details: err.message });
    }
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;