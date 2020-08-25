const axios = require("axios");
const cheerio = require("cheerio");
const { get } = require("mongoose");

// extracts number from text/string
function getNumber(string) {
    return string.match(/\d+(?:\.\d+)?/g).join("");
}

// get page source contents
async function find(url) {
    // make http request to get source content
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data); // loads html
        let stockNb, price;

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
        }
    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;