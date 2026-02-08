const { Schema } = require("mongoose");

let OrdersSchema = new Schema({
    name: String,
    qty: Number,
    price: Number,
    mode: String,
});

module.exports = { OrdersSchema };