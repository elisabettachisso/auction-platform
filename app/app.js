const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("routes/route.js");
const auth = require("auth.js");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auction", router);
app.use("/api/auth", auth);

app.listen(port, () => {
    console.log("Connected to port number:", port);
});

