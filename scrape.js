const puppeteer = require('puppeteer');

// mongo schemas
const Product = require("./modals/productSchema").Product;

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
        await page.goto(url, {
            waitUntil: ['networkidle2']
        })
        await page.goto(url);
        await page.waitFor(5000);

        // start scrapin here

        // wait for element to load.. else code breaks
        await page.waitForSelector("#dp-container");

        // screenshot
        const base64img = await page.screenshot({ encoding: "base64" });

        const scrapeData = await page.evaluate(() => {
            // extracts number from text/string
            function getNumber(string) {
                return string.match(/\d+(?:\.\d+)?/g).join("");
            }

            // get title
            title = document.querySelector("#productTitle.a-size-large.product-title-word-break").innerText;

            // get stock amount
            // const stockHtmlTags = [document.querySelector(".a-size-medium.a-color-success"), document.querySelector(".a-size-medium.a-color-state")];
            const stockHtmlTags = [document.querySelector(".a-size-medium.a-color-success")];
            stockHtmlTags.forEach(tag => {
                tag !== null || tag !== "" ? stockNb = tag.innerText : null;
            });

            // finding correct price
            // const priceHtmlTags = [document.querySelector("#price_inside_buybox.a-size-medium.a-color-price"), document.querySelector("#priceblock_ourprice.a-size-medium.a-color-price")];
            const priceHtmlTags = [document.querySelector("#priceblock_ourprice.a-size-medium.a-color-price")];
            priceHtmlTags.forEach(tag => {
                tag !== null || tag !== "" ? price = getNumber(tag.innerText) : null;
            });

            //getting shipping costs
            const shippingHtmlTags = [document.querySelector("#ourprice_shippingmessage .a-color-secondary.a-size-base")];
            shippingHtmlTags.forEach(tag => {
                tag !== null || tag !== "" ? shipping = getNumber(tag.innerText) : shipping = 0;
            });

            // total price of item 
            const totalPrice = parseFloat(price) + parseFloat(shipping);

            return {
                title,
                stockNb,
                price,
                shipping,
                totalPrice
            }
        });

        console.log(scrapeData);

        // end
        await browser.close();

        return {
            stockNb: scrapeData.stockNb,
            price: scrapeData.price,
            title: scrapeData.title,
            shipping: scrapeData.shipping,
            totalPrice: scrapeData.totalPrice,
            key,
            base64img
        }
    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;