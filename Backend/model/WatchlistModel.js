const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Ensure a user can add a symbol to their watchlist only once
WatchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

const WatchlistModel = mongoose.model("Watchlist", WatchlistSchema);

module.exports = WatchlistModel;
