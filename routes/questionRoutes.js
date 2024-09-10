const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/round1', questionController.getAllQuestionsRound1);
router.get('/round2', questionController.getAllQuestionsRound2);
router.get('/round3', questionController.getRandomQuestionRound3);

router.post('/submit/round1', questionController.submitRound1);
router.post('/submit/round2', questionController.submitRound2);

router.put('/update/round1', questionController.updateQuestionsRound1);
router.put('/update/round2', questionController.updateQuestionsRound2);
router.put('/update/round3', questionController.updateQuestionsRound3);

module.exports = router;