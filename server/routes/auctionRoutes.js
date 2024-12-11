const express = require("express");
const connection = require("../config/db"); 
const router = express.Router();
const verifyToken = require("../middlewares/auth");

// GET /api/auctions?q=query
router.get('/', (req, res) => {
  const query = req.query.q ? `%${req.query.q}%` : '%';

  connection.query(
    'SELECT * FROM auctions WHERE title LIKE ?',
    [query],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Errore durante il recupero delle aste' });
      }
      res.json(results);
    }
  );
});

// POST /api/auctions
router.post('/', verifyToken, (req, res) => {
  const { title, description, start_price, end_date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !start_price || !end_date) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }  

  connection.query(
    'INSERT INTO auctions (title, description, start_price, user_id, end_date) VALUES (?, ?, ?, ?, ?)',
    [title, description, start_price, userId, end_date],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Errore durante la creazione dell\'asta' });
      }
      res.status(201).json({ id: results.insertId });
    }
  );
});

// GET /api/auctions/:id

router.get('/:id', (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT * FROM auctions WHERE id = ?',
    [id],
    (err, results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'Asta non trovata' });
      }
      res.json(results[0]);
    }
  );
});

// PUT /api/auctions/:id

router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  connection.query(
    'UPDATE auctions SET title = ?, description = ? WHERE id = ? AND user_id = ?',
    [title, description, id, userId],
    (err, results) => {
      if (results.affectedRows === 0) {
        return res.status(403).json({ message: 'Non autorizzato' });
      }
      res.json({ message: 'Asta aggiornata con successo' });
    }
  );
});

// DELETE /api/auctions/:id

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  connection.query(
    'DELETE FROM auctions WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, results) => {
      if (results.affectedRows === 0) {
        return res.status(403).json({ message: 'Non autorizzato' });
      }
      res.json({ message: 'Asta eliminata con successo' });
    }
  );
});

//GET /api/auctions/:id/bids

router.get('/:id/bids', (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT * FROM bids WHERE auction_id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Errore durante il recupero delle offerte' });
      }
      res.json(results);
    }
  );
});

// POST /api/auctions/:id/bids

router.post('/:id/bids', verifyToken, (req, res) => {
  const { id } = req.params;
  const { bid_price } = req.body;
  const userId = req.user.id;

  connection.query('SELECT current_price FROM auctions WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Asta non trovata' });
    }
    const currentPrice = results[0].current_price;
    if (bid_price <= currentPrice) {
      return res.status(400).json({ message: 'L\'offerta deve essere maggiore del prezzo corrente' });
    }
    connection.query(
      'INSERT INTO bids (auction_id, user_id, bid_price) VALUES (?, ?, ?)',
      [id, userId, bid_price],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Errore durante la creazione dell\'offerta' });
        }
        res.status(201).json({ id: results.insertId });
      }
    );
  });  
});

module.exports = router;
