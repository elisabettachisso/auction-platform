CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  surname VARCHAR(50),
  icon VARCHAR(255),  -- URL o percorso per l'icona dell'utente
  image VARCHAR(255)  -- URL o percorso per un'immagine dell'utente
);

CREATE TABLE auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  start_price FLOAT,
  current_price FLOAT,
  end_date DATETIME,
  user_id INT,
  icon VARCHAR(255),  -- URL o percorso per l'icona dell'asta
  image VARCHAR(255), -- URL o percorso per un'immagine dell'asta
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  auction_id INT,
  user_id INT,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
