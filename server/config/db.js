require('dotenv').config();
const mysql = require('mysql2');

console.log("Tentativo di connessione con:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Crea una connessione al database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Aggiungi il numero di porta
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connetti al database
connection.connect(err => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    process.exit(1);
  }
  console.log('Connesso a MySQL!');
});

module.exports = connection;
