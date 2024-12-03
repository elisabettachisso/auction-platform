const express = require("express");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const db = require("../db.js");

const verifyToken = (req, res, next) => {
    const token = req.cookies["token"];
    if(!token){
        res.status(403).json({"msg": "Failed authentication"});
        return;
    }
    try {
        const decoded = jwt.verify(token, "not a secret");
        req.userId = decoded.id;
        next();
    } catch (error){
        res.status(401).json({"msg": "Unauthorized"});
    }

};

router.get("/users/:id", async (req, res) => {
    const mongo = await db.connectToDb();
    const user = await mongo.collection("users").findOne({id: parseInt(req.params.id)});
    const {id, username, name, surname} = user;
    res.json({id, username, name, surname});
});

router.get("/messages/:userId", async (req, res) => {
    const id = parseInt(req.params.userId);
    const mongo = await db.connectToDatabase();
    const messages = mongo.collection("messages").find({userID: id}).limit(20);
    const output = [];
    for await (const msg of messages){
        const {text, userID, date, _id} = msg;
        const likes = await findLikes(_id.toString());
        output.push({_id, text, userID, date, likes});
    }
    messages.close();
    res.json(output);
});

router.get("/messages/:userId/:idMessage", async (req, res) => {
    const userID = parseInt(req.params.userId);
    const _id = ObjectId(req.params.idMessage);
    const mongo = await db.connectToDatabase();
    const message = await mongo.collection("messages").findOne({userID, _id});
    if(message){
        message.likes = await findLikes(req.params.idMessage);
        res.json(message);
    } else {
        res.status(404).json({msg: "Message not found"});
    }
    
});

router.post("/messages", verifyToken, async (req, res) => {
    const msg = {
        userID: req.userId,
        text: req.body.text,
        date: Date.now()
    };
    
    const mongo = await db.connectToDatabase();
    const result = await mongo.collection("messages").insertOne(msg);
    msg._id = result.insertedId;
    res.json(msg);

});

router.get("/followers/:id", async (req, res) => {
    const mongo = await db.connectToDatabase();
    const query = {follow: parseInt(req.params.id)};
    const result = await mongo.collection("followers").find(query);
    const output = [];
    for await (const following of result){
        const {follower} = following;
        output.push({follower});
    }
    result.close();
    res.json(output);
});

router.post("/followers/:id", verifyToken, async (req, res) => {
    const mongo = await db.connectToDatabase();
    const following = {follower: req.userId, follow: parseInt(req.params.id)};
    await mongo.collection("followers").insertOne(following);
    res.json(following);
});

router.delete("/followers/:id", verifyToken, async (req, res) => {
    const mongo = await db.connectToDatabase();
    const following = {follower: req.userId, follow: parseInt(req.params.id)};
    await mongo.collection("followers").deleteOne(following);
    res.json(following);
});

router.get("/feed", verifyToken, async (req, res) => {
    const mongo = await db.connectToDatabase();
    const result = mongo.collection("followers").find({follower: req.userId});
    const following = [];
    for await (const r of result){
        following.push(r.follow);
    }
    const query = {id: {$in: following}};
    const messages = mongo.collection("messages").find(query, {sort: {date: -1}, limit: 50});
    const output = await messages.toArray();
    res.json(output);
});

router.post("/like/:idMessage", verifyToken, async (req, res) => {
    const mongo = await db.connectToDatabase();
    const like = {user: req.userId, message: req.params.idMessage};
    await mongo.collection("likes").insertOne(like);
    res.json(like);
});

router.delete("/like/:idMessage", verifyToken, async (req, res) => {
    const mongo = await db.connectToDatabase();
    const like = {user: req.userId, message: req.params.id};
    await mongo.collection("likes").deleteOne(like);
    res.json(like);
});

router.get("/search", async (req, res) => {
    let q = req.query.q;
    const mongo = await db.connectToDatabase();
    const query = {username: new RegExp(`${q}`)};
    console.log(query);
    const cur = mongo.collection("users").find(query);
    const output = [];
    for await (const user of cur){
        const {username, name, surname, id, bio } = user;
        output.push({username, name, surname, id, bio });
    }
    res.send(output);
});

module.exports = router;