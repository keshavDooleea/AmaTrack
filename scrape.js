const puppeteer = require('puppeteer');
const got = require("got");
const jsdom = require("jsdom");

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
async function find(url) {
    try {
        let stockNb, price, title, shipping, key;

        // key
        key = await checkKey();

        // take screenshot
        console.log("start")
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] }, { defaultViewport: null });
        const page = await browser.newPage();
        await page.setViewport({
            width: 980,
            height: 830,
            deviceScaleFactor: 1,
        });
        await page.goto(url);
        const base64img = await page.screenshot({ encoding: "base64" });
        await browser.close();

        await got(url).then(res => {
            const DOM = new jsdom.JSDOM(res.body).window.document;
            title = DOM.querySelector("#productTitle.a-size-large.product-title-word-break").textContent;

            // get stock amount
            const stockHtmlTags = [DOM.querySelector(".a-size-medium.a-color-success"), DOM.querySelector(".a-size-medium.a-color-state")];
            stockHtmlTags.forEach(tag => {
                if (tag !== null) {
                    stockNb = tag.textContent;
                }
            });

            // finding correct price
            const priceHtmlTags = [DOM.querySelector("#price_inside_buybox.a-size-medium.a-color-price"), DOM.querySelector("#priceblock_ourprice.a-size-medium.a-color-price")];
            priceHtmlTags.forEach(tag => {
                if (tag !== null) {
                    price = getNumber(tag.textContent);
                }
            });

            // getting shipping costs
            const shippingHtmlTags = [DOM.querySelector("#ourprice_shippingmessage .a-color-secondary.a-size-base")];
            shippingHtmlTags.forEach(tag => {
                if (tag !== null) {
                    shipping = getNumber(tag.textContent);
                } else {
                    shipping = 0;
                }
            });

            // total price of item 
            totalPrice = parseFloat(price) + parseFloat(shipping);

            // if (DOM.querySelector(".a-size-medium.a-color-success") !== null) {
            //     stockNb = DOM.querySelector(".a-size-medium.a-color-success").textContent;
            // } else {
            //     stockNb = DOM.querySelector(".a-size-medium.a-color-state");
            // }
        });

        return {
            stockNb,
            price,
            title,
            shipping,
            totalPrice,
            key,
            base64img
        }
    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;