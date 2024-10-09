const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/round/:round', questionController.getQuestionsByRound);
router.get('/domain/:domain', questionController.getQuestionByDomain);
router.get('/round1', questionController.getAllQuestionsRound1);
router.get('/round2', questionController.getAllQuestionsRound2);
router.get('/round3', questionController.getRandomQuestionRound3);

router.post('/submit', questionController.submitAnswers);

router.post('/submit-code', questionController.submitCode);

module.exports = router;