const { Schema } = require("mongoose");

let UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    availableBalance: { type: Number, default: 100000.0 },
    totalDeposited: { type: Number, default: 0.0 }
});

module.exports = { UserSchema };
