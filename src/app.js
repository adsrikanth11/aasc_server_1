const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(cors()); // Enable CORS for all routes

// Serve static files
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the AASC Server Application');
});

// Import routes
app.use('/student', require('./routes/frontend/student_reg_form.route'));

// 404 handler
app.use((req, res, next) => {
  const message = `404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`;
  console.error(message); // Log 404
  res.status(404).json({
    message: 'The requested route is not found on this server.',
  });
});

module.exports = app;