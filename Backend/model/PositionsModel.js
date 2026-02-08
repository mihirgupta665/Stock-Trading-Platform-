const mongoose = require("mongoose");
const { PositionsSchema } = require("../schemas/PositionsSchema");

let PositionsModel = mongoose.model("Position", PositionsSchema);

module.exports =  PositionsModel ; 