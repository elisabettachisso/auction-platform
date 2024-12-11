const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Accesso negato: token mancante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aggiunge i dati dell'utente alla richiesta
    next();
  } catch (err) {
    res.status(403).json({ message: "Token non valido" });
  }
};

module.exports = verifyToken;