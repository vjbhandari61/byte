const Team = require('../models/Team');

// Remove this line:
// const bcrypt = require('bcrypt');

exports.createTeam = async (teamName) => {
  const team = new Team({ teamName });
  return await team.save();
};

exports.getAllTeams = async () => {
  return await Team.find();
};

exports.updateScore = async (teamName, newScore, round) => {
  try {
    const team = await Team.findOne({ teamName });
    if (!team) {
      throw new Error('Team not found');
    }
    
    console.log(`Updating score for team ${teamName}, round ${round}. Current score: ${team.score}, New score to add: ${newScore}`);
    
    // You might want to store round-specific scores separately
    if (!team.roundScores) {
      team.roundScores = {};
    }
    team.roundScores[round] = (team.roundScores[round] || 0) + newScore;
    
    team.score += newScore;
    
    console.log(`Updated total score: ${team.score}, Round ${round} score: ${team.roundScores[round]}`);
    
    await team.save();
    
    return team;
  } catch (error) {
    console.error('Error updating team score:', error);
    throw error;
  }
};

// Add this new function
exports.getTeamByName = async (teamName) => {
  return await Team.findOne({ teamName });
};

exports.verifyAdmin = async (username, password) => {
    const admin = await Team.findOne({ username, password, role: 'admin' });
    return admin;
};

exports.getTeamScores = async () => {
    return await Team.find({ role: 'team' }).sort({ score: -1 }).select('teamName score');
};

// Add this new function
exports.getAdminByUsername = async (username) => {
    return await Team.findOne({ username, role: 'admin' });
};