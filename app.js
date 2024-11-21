// app.js
require('dotenv').config(); // Mengambil nilai dari file .env

const express = require('express');
const mysql = require('./db');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Menggunakan PORT dari .env atau default 3000
const port = process.env.PORT;

// Set EJS as view engine
app.set('view engine', 'ejs');

// Setup static folder for serving images
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Multer for file uploads (store photos in 'public/uploads' folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename collisions
    }
});
const upload = multer({ storage: storage });

// Route to display all fish items
app.get('/', (req, res) => {
    mysql.query('SELECT * FROM items', (err, results) => {
        if (err) throw err;
        res.render('index', { items: results });
    });
});

// Route to create a new fish item (form)
app.get('/add', (req, res) => {
    res.render('add');
});

// Route to handle form submission to create a new fish item
app.post('/add', upload.single('foto'), (req, res) => {
    const { nama_ikan, ciri_ciri, famili } = req.body;
    const foto = req.file ? '/uploads/' + req.file.filename : null;

    mysql.query('INSERT INTO items (nama_ikan, ciri_ciri, foto, famili) VALUES (?, ?, ?, ?)', [nama_ikan, ciri_ciri, foto, famili], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Route to update a fish item (edit form)
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    mysql.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { item: results[0] });
    });
});

// Route to handle updating a fish item
app.post('/edit/:id', upload.single('foto'), (req, res) => {
    const id = req.params.id;
    const { nama_ikan, ciri_ciri, famili } = req.body;
    const foto = req.file ? '/uploads/' + req.file.filename : req.body.foto;

    mysql.query('UPDATE items SET nama_ikan = ?, ciri_ciri = ?, foto = ?, famili = ? WHERE id = ?', [nama_ikan, ciri_ciri, foto, famili, id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Route to delete a fish item
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    mysql.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
