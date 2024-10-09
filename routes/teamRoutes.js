const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/register', teamController.registerTeam);

router.get('/', teamController.getAllTeams);

router.post('/', teamController.createTeam);

router.post('/login', teamController.adminLogin);
router.get('/scores', teamController.getTeamScores);

module.exports = router;