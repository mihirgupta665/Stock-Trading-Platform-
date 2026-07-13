const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true },
    averagePrice: { type: Number, required: true },
    investedAmount: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    marketValue: { type: Number, default: 0 },
    totalPnL: { type: Number, default: 0 },
    totalPnLPercent: { type: Number, default: 0 },
    exchange: { type: String, required: true },

    // Legacy fields for frontend compatibility
    name: { type: String }, // symbol
    qty: { type: Number },  // quantity
    avg: { type: Number },  // averagePrice
    price: { type: Number }, // currentPrice
    net: { type: String, default: "0.00" },
    day: { type: String, default: "+0.00%" }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate holdings for same stock per user
HoldingsSchema.index({ user: 1, symbol: 1 }, { unique: true });

HoldingsSchema.pre("save", function () {
    if (!this.name) this.name = this.symbol;
    if (!this.qty) this.qty = this.quantity;
    if (!this.avg) this.avg = this.averagePrice;
    if (!this.price) this.price = this.currentPrice;

    this.investedAmount = this.averagePrice * this.quantity;
    this.marketValue = this.currentPrice * this.quantity;
    this.totalPnL = this.marketValue - this.investedAmount;
    
    if (this.investedAmount > 0) {
        this.totalPnLPercent = (this.totalPnL / this.investedAmount) * 100;
    } else {
        this.totalPnLPercent = 0;
    }

    this.net = (this.totalPnL >= 0 ? "+" : "") + this.totalPnLPercent.toFixed(2) + "%";
});

const HoldingsModel = mongoose.model("holding", HoldingsSchema);

module.exports = HoldingsModel;