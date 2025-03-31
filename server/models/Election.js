const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    name: String,
    date: String,
    status: { type: String, enum: ['upcoming', 'current', 'started', 'stopped'], default: 'upcoming' }
});

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;
