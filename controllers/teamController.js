const teamService = require('../services/teamService');
const logger = require('../utils/logger');

exports.createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body.teamName);
    res.status(201).json(team);
  } catch (error) {
    logger.error('Error in createTeam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.registerTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const newTeam = await teamService.createTeam(teamName);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await teamService.verifyAdmin(username, password);
        if (admin) {
            // Remove JWT token generation
            res.json({ message: 'Login successful', admin: { id: admin._id, username: admin.username } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        logger.error('Error in adminLogin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTeamScores = async (req, res) => {
    try {
        const scores = await teamService.getTeamScores();
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};