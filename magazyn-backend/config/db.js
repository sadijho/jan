// Plik połączenia z bazą danych z pomocą zmiennych środowiskowych

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    process.exit(1);
  }

  console.log('Połączono z bazą danych.');

  connection.release();
});

module.exports = pool;