const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.put('/questions', adminController.updateQuestions);

// Add other admin-specific routes here

module.exports = router;