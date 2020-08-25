require("dotenv/config");
const router = require("express").Router();
const mongo = require("mongoose");
const scrapeProduct = require("../scrape");
let mailer = require("nodemailer");

// mongo schemas
const Product = require("../modals/productSchema").Product;

// Mongo connection
mongo.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION,
    { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
    () => console.log("connected to DB!"));

// Routes
router.get("/", (req, res) => {
    res.send("/get");
});

router.get("/scrapeInfo", async (req, res) => {
    const url = req.query.url;
    const item = await scrapeProduct(url);
    res.json(item);
});

router.get("/notify", (req, res) => {
    res.send("/notify");
});

module.exports = router;