const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the 'updatedAt' field on save
teamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;