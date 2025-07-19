const mysql = require('mysql2/promise');

const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

pool.getConnection()
   .then(connection => {
      console.log('✅ MySQL Database connected successfully.');
      connection.release();
   })
   .catch(error => {
      console.error('❌ Failed to connect to MySQL Database:', error);
      process.exit(1); // Exit process if DB connection fails
   });

module.exports = pool;
