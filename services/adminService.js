const Admin = require('../models/Admin');
const Team = require('../models/Team');
const Question = require('../models/Question');

exports.login = async (username, password) => {
  const admin = await Admin.findOne({ username });
  if (admin && admin.password === password) {
    return admin;
  }
  return null;
};

exports.getAllTeams = async () => {
  return await Team.find().sort({ score: -1 });
};

exports.updateQuestions = async (round, questions) => {
  await Question.deleteMany({ round });
  return await Question.insertMany(questions.map(q => ({ ...q, round })));
};