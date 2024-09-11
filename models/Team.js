const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('Team', teamSchema);