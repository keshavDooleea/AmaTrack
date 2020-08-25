const axios = require("axios");
const cheerio = require("cheerio");
const { get } = require("mongoose");

// extracts number from text/string
function getNumber(string) {
    return string.match(/\d+(?:\.\d+)?/g).join("");
}

async function find(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // get stock amount
        const stockHtmlTags = [$(".a-size-medium.a-color-success").text(), $(".a-size-medium.a-color-state").text()];
        let stockNb;

        stockHtmlTags.forEach(tag => {
            tag !== "" ? stockNb = tag : null;
        });

        // finding correct price
        let priceHtmlTags = [$("#price_inside_buybox.a-size-medium.a-color-price").text(), $("#priceblock_ourprice.a-size-medium.a-color-price").text()];
        let price;

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