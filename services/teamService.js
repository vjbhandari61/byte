const Team = require('../models/Team');
const Admin = require('../models/Admin');

exports.createTeam = async (teamName) => {
  const exists = await Team.findOne({ teamName });
  if (!exists) {
    const team = new Team({ teamName });
    return await team.save();
  } else {
    throw new Error('Team already exists');
  }
};

exports.getAllTeams = async () => {
  return await Team.find().sort({ score: -1 });
};

// exports.updateScore = async (teamName, newScore, round) => {
//   try {
//     const team = await Team.findOne({ teamName });
//     if (!team) {
//       throw new Error('Team not found');
//     }
    
//     console.log(`Updating score for team ${teamName}, round ${round}. Current score: ${team.score}, New score to add: ${newScore}`);
    
//     // You might want to store round-specific scores separately
//     if (!team.roundScores) {
//       team.roundScores = {};
//     }
//     team.roundScores[round] = (team.roundScores[round] || 0) + newScore;
    
//     team.score += newScore;
    
//     console.log(`Updated total score: ${team.score}, Round ${round} score: ${team.roundScores[round]}`);
    
//     await team.save();
    
//     return team;
//   } catch (error) {
//     console.error('Error updating team score:', error);
//     throw error;
//   }
// };


exports.updateScore = async (teamName, scoreIncrement) => {
  return await Team.findOneAndUpdate(
    { teamName: teamName },
    { $inc: { score: scoreIncrement } },
    { new: true }
  );
};

exports.getTeamByName = async (teamName) => {
  return await Team.findOne({ name: teamName });
};

// Add this new function
exports.getTeamByName = async (teamName) => {
  return await Team.findOne({ teamName });
};

exports.verifyAdmin = async (username, password) => {
    const admin = await Admin.findOne({ username });
    if (admin) {
        return admin;
    }
    return null;
};

exports.getAdminByUsername = async (username) => {
    return await Admin.findOne({ username });
};
