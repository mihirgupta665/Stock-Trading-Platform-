const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockMasterSchema = new Schema({
    symbol: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    exchange: { type: String, required: true },
    country: { type: String },
    sector: { type: String },
    industry: { type: String },
    logo: { type: String },
    currency: { type: String, default: "INR" },
    isDynamic: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

const StockMasterModel = mongoose.model("StockMaster", StockMasterSchema);

module.exports = StockMasterModel;
