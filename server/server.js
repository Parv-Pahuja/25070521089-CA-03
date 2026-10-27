// Main file of the backend. Run it with: npm run dev
require('dotenv').config(); // loads the values from .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Stop early if the secret is missing (tokens cannot be signed without it)
if (!process.env.JWT_SECRET) {
  console.log('JWT_SECRET is missing in server/.env');
  process.exit(1);
}

// Connect to the database, then make sure the indexes are up to date
// (syncIndexes removes the old shared Mission Log index and adds the per-user one)
connectDB().then(() => require('./models/SavedArticle').syncIndexes().catch((e) => console.log('Index sync:', e.message)));

// Middlewares
app.use(cors());         // lets the React app (different port) talk to this server
app.use(express.json()); // lets us read JSON sent from React

// All routes start with /api
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/reactions', require('./routes/reactionRoutes'));
app.use('/api/saved', require('./routes/savedRoutes'));

// Simple test route
app.get('/api', (req, res) => res.json({ message: 'Orbit API is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
