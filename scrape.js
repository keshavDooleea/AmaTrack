const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

// extracts number from text/string
function getNumber(string) {
    return string.match(/\d+(?:\.\d+)?/g).join("");
}

// generate random key
function randomKey(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

// get page source contents
async function find(url) {
    // make http request to get source content
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data); // loads html
        let stockNb, price, title, key;

        // get title
        title = $("#productTitle.a-size-large.product-title-word-break").text();

        // key
        key = randomKey(8);

        // take screenshot
        const imgPath = `./frontend/public/screenshots/${key}.png`;
        const browser = await puppeteer.launch({ defaultViewport: null });
        const page = await browser.newPage();
        await page.setViewport({
            width: 980,
            height: 830,
            deviceScaleFactor: 1,
        });
        await page.goto(url);
        await page.screenshot({ path: imgPath });
        await browser.close();

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

        return {
            stockNb,
            price,
            title,
            key
        }
    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;