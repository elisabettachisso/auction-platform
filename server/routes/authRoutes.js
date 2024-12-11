const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db'); 
const router = express.Router();
const authenticateUser = require('../middlewares/auth');

// POST /api/auth/signup

router.post('/signup', async (req, res) => {
  const { username, password, name, surname } = req.body;

  // Verifica se l'utente esiste già
  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Errore durante la verifica dell\'utente' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username già in uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      'INSERT INTO users (username, password, name, surname) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, name, surname],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Errore durante la registrazione' });
        }

        res.status(201).json({
          id: results.insertId,
          username,
          name,
          surname,
        });
      }
    );
  });
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    console.log("Risultati query:", results);
    if (err) {
      console.error("Errore durante il login:", err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      console.log("Username not found:", username);
      return res.status(400).json({ message: 'Username not found' });
    }

    const user = results[0];
    console.log("Username:", user);

    // Crea un JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      message: 'Logged in!',
      token,
    });
  });
});


router.get('/users', authenticateUser, (req, res) => {
  connection.query('SELECT id, username, name, surname FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Errore durante il recupero degli utenti' });
    }

    res.json(results);
  });
});

router.get('/test-bcrypt', async (req, res) => {
  const password = "admin"; // Cambia con la password salvata nel database
  const hash = "$2a$10$5XQ9iksBgIwzVnEU2OxHgeMfk3MTVh3P5Nosmq8KI92LjTlZzGE6."; // Sostituisci con l'hash reale

  const isMatch = await bcrypt.compare(password, hash);
  res.json({ isMatch });
});

module.exports = router;
