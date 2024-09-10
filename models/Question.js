const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [String],
  correctAnswer: { type: String, required: true },
  round: { type: Number, required: true },
  domain: String,
  testCases: [{ input: String, output: String }]
});

module.exports = mongoose.model('Question', questionSchema);