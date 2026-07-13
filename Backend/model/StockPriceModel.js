const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockPriceSchema = new Schema({
    symbol: { type: String, required: true, unique: true, index: true },
    currentPrice: { type: Number, required: true },
    open: { type: Number },
    high: { type: Number },
    low: { type: Number },
    previousClose: { type: Number },
    change: { type: Number },
    changePercent: { type: Number },
    volume: { type: Number },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const StockPriceModel = mongoose.model("StockPrice", StockPriceSchema);

module.exports = StockPriceModel;
