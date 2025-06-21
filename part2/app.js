const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');

// Session middleware - added for login authentication
app.use(session({
    secret: 'your-secret-key', // change this to a secure
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));


app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT d.name AS dog_name, d.size, u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id
            ORDER BY d.name
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching dogs:', err);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;