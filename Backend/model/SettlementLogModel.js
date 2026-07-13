const mongoose = require("mongoose");
const { Schema } = mongoose;

const SettlementLogSchema = new Schema({
    settledAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true },
    positionsSettledCount: { type: Number, default: 0 },
    error: { type: String },
    details: [Schema.Types.Mixed]
}, {
    timestamps: true
});

const SettlementLogModel = mongoose.model("SettlementLog", SettlementLogSchema);

module.exports = SettlementLogModel;
