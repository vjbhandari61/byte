const Admin = require('../models/Admin');
const Question = require('../models/Question');

exports.verifyAdmin = async (username, password) => {
    const admin = await Admin.findOne({ username });
    if (admin) {
        return admin;
    }
    return null;
};

exports.updateQuestions = async (round, questions) => {
};
