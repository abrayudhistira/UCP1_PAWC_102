// db.js
require('dotenv').config(); // Mengambil nilai dari file .env

const mysql = require('mysql2');

// Koneksi ke database menggunakan variabel dari .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

module.exports = connection;
