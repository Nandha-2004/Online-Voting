const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    party: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    symbol: { type: String, required: true },
    voting_count: { type: Number, default: 0 } // Added field with default 0
});

module.exports = mongoose.model('Candidate', CandidateSchema);
