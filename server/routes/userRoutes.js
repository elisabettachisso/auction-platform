const express = require('express');
const router = express.Router();

// API di login
router.post('/auth/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenziali non valide' });
  }

  res.json({ message: 'Login riuscito', user });
});

router.get('/', (req, res) => {
  const query = req.query.q ? `%${req.query.q}%` : '%';

  connection.query(
    'SELECT id, username, name, surname FROM users WHERE username LIKE ?',
    [query],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Errore durante il recupero degli utenti' });
      }
      res.json(results);
    }
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT id, username, name, surname FROM users WHERE id = ?',
    [id],
    (err, results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }
      res.json(results[0]);
    }
  );
});

module.exports = router;
