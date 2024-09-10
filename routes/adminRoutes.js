const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/teams', adminController.getAllTeams);
router.post('/questions', adminController.updateQuestions);
router.get('/questions', adminController.getAllQuestions);
router.get('/questions/:id', adminController.getQuestionById);
router.get('/teams', adminController.getAllTeamsWithScores);
router.get('/teams/:id', adminController.getTeamById);
router.get('/stats', adminController.getGameStats);

module.exports = router;