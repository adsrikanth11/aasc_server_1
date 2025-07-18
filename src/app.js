const express = require('express');
const app = express();

// Serve static files
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the AASC Server Application');
});

// 404 handler
app.use((req, res, next) => {
  const message = `404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`;
  console.error(message); // Log 404
  res.status(404).json({
    message: 'The requested route is not found on this server.',
  });
});

module.exports = app;