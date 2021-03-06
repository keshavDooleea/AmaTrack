const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const fetch = require("node-fetch");


// mongo schemas
const Product = require("./modals/productSchema").Product;

// extracts number from text/string
function getNumber(string) {
    return string.match(/\d+(?:\.\d+)?/g).join("");
}

// generate random key
function randomKey(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

async function checkKey() {
    let product = {};
    let myKey;

    // checks is key is unique, else regenerate
    while (product !== null) {
        myKey = randomKey(8);
        product = await Product.findOne({ key: myKey });
    }

    return myKey;
}

// get page source contents
async function find(url, res) {
    // make http request to get source content
    try {
        // take screenshot
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] }, { defaultViewport: null });
        const page = await browser.newPage();
        await page.setViewport({
            width: 980,
            height: 830,
            deviceScaleFactor: 1,
        });
        await page.goto(url);
        const base64img = await page.screenshot({ encoding: "base64" });
        // await browser.close();

        fetch(url)
            .then(res => {
                return res.text();
            })
            .then(async data => {
                let stockNb, price, title, shipping, key;
                const $ = cheerio.load(data); // loads html

                // key
                key = await checkKey();

                // get title
                title = $("#productTitle.a-size-large.product-title-word-break").text();

                // get stock amount
                const stockHtmlTags = [$(".a-size-medium.a-color-success").text(), $(".a-size-medium.a-color-state").text()];
                stockHtmlTags.forEach(tag => {
                    tag !== "" ? stockNb = tag : null;
                });

                // finding correct price
                const priceHtmlTags = [$("#price_inside_buybox.a-size-medium.a-color-price").text(), $("#priceblock_ourprice.a-size-medium.a-color-price").text()];
                priceHtmlTags.forEach(tag => {
                    tag !== "" ? price = getNumber(tag) : null;
                });

                // getting shipping costs
                const shippingHtmlTags = [$("#ourprice_shippingmessage .a-color-secondary.a-size-base").text()];
                shippingHtmlTags.forEach(tag => {
                    tag !== "" ? shipping = getNumber(tag) : shipping = 0;
                });

                // total price of item 
                const totalPrice = parseFloat(price) + parseFloat(shipping);

                console.log("done")

                res.json({
                    stockNb,
                    price,
                    title,
                    shipping,
                    totalPrice,
                    key,
                    base64img
                });
            });
    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;