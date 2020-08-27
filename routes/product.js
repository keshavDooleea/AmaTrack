require("dotenv/config");
const router = require("express").Router();
const mongo = require("mongoose");
const scrapeProduct = require("../scrape");
const fs = require('fs')
const { type } = require("os");
const email = require("../email");

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

router.post("/insertDB", async (req, res) => {
    const data = req.body;
    console.log(data);

    await Product.findOne({ key: data.key }, async (err, product) => {
        if (err) {
            console.log(`/insertDB ERROR : ${err}`);
            res.json({
                status: 400,
                message: err
            });
        }

        // inexistant
        if (product === null) {
            const newProduct = new Product({
                url: data.url,
                key: data.key,
                email: data.email,
                actualPrice: data.actualPrice,
                desiredPrice: data.desiredPrice,
                isInStock: true
            });

            await newProduct.save();
            console.log(`new product saved`);

            // send email here
            email.sendConfirmationEmail(data.email, data.key, res);
        }
        else {
            res.json({
                status: 400,
                message: err
            });
        }
    });
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
                console.log(`deleted image: ${path}`);
            }
        });

        res.json(null);
    } catch (err) {
        console.error(`DELETE KEY ROUTER ERROR : ${err}`);
    }
});

module.exports = router;