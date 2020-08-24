const axios = require("axios");
const cheerio = require("cheerio");

function find(url) {
    try {
        console.log("SCRAPE: " + url);

    } catch (error) {
        console.log(`scrape.js: ${error}`);
    }
}

module.exports = find;