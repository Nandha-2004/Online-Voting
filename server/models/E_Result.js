const mongoose = require("mongoose");

const eResultSchema = new mongoose.Schema({
    partyName: { type: String, required: true, unique: true },
    voting_count: { type: Number, default: 0 }
});

const E_Result = mongoose.model("e_result", eResultSchema);
module.exports = E_Result;
