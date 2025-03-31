const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    dob: { type: String, required: true },
    voterid: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    voteStatus: { type: String, default: "Not Voted" },
    image: { type: String }  // Store only the image filename
});

const Voter = mongoose.model("Voter", voterSchema);
module.exports = Voter;
