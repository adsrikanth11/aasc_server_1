const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
// Ensure you have set SMTP_USER and SMTP_PASSWORD in your .env file
const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,           // e.g. smtp.gmail.com
   port: process.env.SMTP_PORT || 587,    // common port for STARTTLS
   secure: process.env.SMTP_PORT || true, // true for 465, false for other ports
   auth: {
      user: process.env.SMTP_USER,        // your email address
      pass: process.env.SMTP_PASSWORD,    // your email password or app-specific password
   },
});

module.exports = transporter;
