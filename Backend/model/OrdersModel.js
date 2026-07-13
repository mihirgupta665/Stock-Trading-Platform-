const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    exchange: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    transactionType: { type: String, enum: ["BUY", "SELL"], required: true },
    orderType: { type: String, enum: ["MARKET", "LIMIT"], default: "MARKET" },
    status: { type: String, enum: ["SUCCESS", "FAILED", "PENDING", "CANCELLED"], default: "SUCCESS" },
    
    // Legacy support fields for frontend compatibility
    name: { type: String }, // stores stock symbol
    qty: { type: Number },  // stores quantity
    mode: { type: String }, // stores "BUY" or "SELL"
}, {
    timestamps: true
});

// Indexes for query performance
OrdersSchema.index({ user: 1, symbol: 1 });
OrdersSchema.index({ user: 1, createdAt: -1 });

// Auto-fill legacy compatibility fields before saving
OrdersSchema.pre("save", function () {
    if (!this.name) this.name = this.symbol;
    if (!this.qty) this.qty = this.quantity;
    if (!this.mode) this.mode = this.transactionType;
});

const OrdersModel = mongoose.model("order", OrdersSchema);

module.exports = OrdersModel;