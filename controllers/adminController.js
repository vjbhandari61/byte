const adminService = require('../services/adminService');
const questionService = require('../services/questionService');
const teamService = require('../services/teamService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await adminService.login(username, password);
    if (admin) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await adminService.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestions = async (req, res) => {
  try {
    const { round, questions } = req.body;
    const updatedQuestions = await adminService.updateQuestions(round, questions);
    res.json(updatedQuestions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTeamsWithScores = async (req, res) => {
  try {
    const teams = await teamService.getAllTeamsWithScores();
    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getGameStats = async (req, res) => {
  try {
    // Implement game statistics logic
    const stats = { /* ... */ };
    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};