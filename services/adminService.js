const Admin = require('../models/Admin');
const Question = require('../models/Question');

exports.verifyAdmin = async (username, password) => {
    const admin = await Admin.findOne({ username });
    if (admin && await admin.comparePassword(password)) {
        return admin;
    }
    return null;
};

exports.updateQuestions = async (round, questions) => {
    // Implement the logic to update questions for a specific round
    // This might involve bulk operations or individual updates
    // Return the updated questions
};

// Add other admin-specific service functions here