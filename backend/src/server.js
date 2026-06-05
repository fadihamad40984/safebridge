require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');

// Connect to database
connectDB();

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SafeBridge API',
    version: config.app.version,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
