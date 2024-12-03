const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./server/db.js");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname, bio } = req.body;
    const mongo = await db.connectToDatabase();
    const user = await mongo.collection("users").findOne({ username });
    console.log(user);
    if (user) {
      res.status(409).json({ msg: "Utente già esistente" });
    } else {
      const lastUser = await mongo
        .collection("users")
        .findOne({}, { sort: { id: -1 } });
      let id = lastUser?.id !== undefined ? lastUser.id : -1;
      id++;
      const newUser = { id, username, password, name, surname, bio };
      await mongo.collection("users").insertOne(newUser);
      res.json({ msg: "Utente creato con successo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const mongo = await db.connectToDatabase();
    const user = await mongo.collection("users").findOne({ username });
    console.log(user);
    if (user && user.password === password && user.username === username) {
      const data = { id: user.id };
      const token = jwt.sign(data, "my cats are better", {
        expiresIn: 86400, // 24 hours
      });
      res.cookie("token", token, {httpOnly: true});
      res.json({ msg: "Autenticazione avvenuta con successo" });
    } else {
      res.status(401).json({ msg: "Username o password errati" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Error" });
  }
});

module.exports = router;
