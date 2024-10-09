const adminService = require('../services/adminService');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await adminService.verifyAdmin(username, password);
    if (admin) {
      const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    logger.error('Error in admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateQuestions = async (req, res) => {
  try {
    const { username, password, round, questions } = req.body;
    const admin = await adminService.verifyAdmin(username, password);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const updatedQuestions = await adminService.updateQuestions(round, questions);
    res.json(updatedQuestions);
  } catch (error) {
    logger.error('Error in updateQuestions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
