const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

app.use(bodyParser.json());

dotenv.config();

// Configurare file statici
app.use(express.static(path.join(__dirname, "public")));

// Servire index.html come homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ---- API REST ---- //

const auctionRoutes = require('./server/routes/auctionRoutes');
const userRoutes = require('./server/routes/userRoutes');
const authRoutes = require('./server/routes/authRoutes');

app.use('/api/auctions', auctionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// ---- SERVER ---- //
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
