const mongo = require("mongoose");

const productSchema = new mongo.Schema({
    url: {
        type: String,
        required: true,
    },
    key: {
        type: Number,
        required: true,
    },
    desiredPrice: {
        type: Number,
    },
    isInStock: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

let Product = mongo.model("Product", productSchema);
module.exports = { Product: Product };