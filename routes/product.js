const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
let mailer = require("nodemailer");

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