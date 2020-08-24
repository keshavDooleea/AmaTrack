require("dotenv/config");
const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
let mailer = require("nodemailer");
const mongo = require("mongoose");

// Mongo connection
mongo.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION,
    { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
    () => console.log("connected to DB!"));

// Routes
router.get("/", (req, res) => {
    res.send("/get");
});

router.get("/scrapeInfo", (req, res) => {
    const url = req.query.url;

    // extract url data
    // post in db

    res.json(url);
});

router.get("/notify", (req, res) => {
    res.send("/notify");
});

module.exports = router;