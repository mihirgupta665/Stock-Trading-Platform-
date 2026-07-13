const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    exchange: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    transactionType: { type: String, enum: ["BUY", "SELL", "DEPOSIT", "WITHDRAWAL"], required: true },
    orderType: { type: String, enum: ["MARKET", "LIMIT"], default: "MARKET" },
    status: { type: String, enum: ["SUCCESS", "FAILED", "PENDING"], required: true },
}, {
    timestamps: true
});

// Indexes for query performance
TransactionSchema.index({ user: 1, symbol: 1 });
TransactionSchema.index({ user: 1, createdAt: -1 });

const TransactionsModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionsModel;
