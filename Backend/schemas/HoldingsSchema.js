const { Schema } = require("mongoose");

let holdingsSchema = new Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});

module.exports = { holdingsSchema };