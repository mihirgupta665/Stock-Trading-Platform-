const mongoose = require("mongoose");
const { OrderSchema } = require("../schemas/OrdersSchema");

const OrdersModel = mongoose.model("Order", OrderSchema);

module.exports =  OrdersModel ;