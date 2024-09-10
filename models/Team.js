const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['team', 'admin'], default: 'team' },
  score: { type: Number, default: 0 },
  roundScores: { type: Map, of: Number, default: {} }
});

module.exports = mongoose.model('Team', teamSchema);