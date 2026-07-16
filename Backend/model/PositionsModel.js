const mongoose = require("mongoose");
const { Schema } = mongoose;

const PositionsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true },
    averagePrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    unrealizedPnL: { type: Number, default: 0 },
    exchange: { type: String, required: true },
    openedAt: { type: Date, default: Date.now },

    // Legacy fields for frontend rendering
    product: { type: String, default: "CNC" },
    name: { type: String }, // symbol
    qty: { type: Number },  // quantity
    avg: { type: Number },  // averagePrice
    price: { type: Number }, // currentPrice
    net: { type: String, default: "0.00" },
    day: { type: String, default: "+0.00%" },
    isLoss: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate positions for same stock per user
PositionsSchema.index({ user: 1, symbol: 1 }, { unique: true });

PositionsSchema.pre("save", function (next) {
    if (!this.name) this.name = this.symbol;
    if (!this.qty) this.qty = this.quantity;
    if (!this.avg) this.avg = this.averagePrice;
    if (!this.price) this.price = this.currentPrice;
    
    this.unrealizedPnL = (this.currentPrice - this.averagePrice) * this.quantity;
    this.isLoss = this.unrealizedPnL < 0;
    next();
});

const PositionsModel = mongoose.model("position", PositionsSchema);

module.exports = PositionsModel;