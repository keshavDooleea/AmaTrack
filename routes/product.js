require("dotenv/config");
const router = require("express").Router();
const mongo = require("mongoose");
const scrapeProduct = require("../scrape");
const fs = require('fs')
let mailer = require("nodemailer");
const { type } = require("os");

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

router.delete("/deleteImg", (req, res) => {
    const keys = req.query.key.split(`"`);
    let path;

    try {
        keys.forEach(key => {
            if (key.length === 8) {
                // remove file
                path = `./frontend/public/screenshots/${key}.png`;
                fs.unlinkSync(path);
                console.log(`deleted image: ${path}.png`);
            }
        });

        res.json(null);
    } catch (err) {
        console.error(`DELETE KEY ROUTER ERROR : ${err}`);
    }
});

module.exports = router;