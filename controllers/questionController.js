const questionService = require('../services/questionService');
const teamService = require('../services/teamService');
const axios = require('axios');
const logger = require('../utils/logger');

exports.getQuestionsByRound = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByRound(req.params.round);
    const questionsWithIds = questions.map(q => ({
      id: q._id,
      question: q.question,
    }));
    res.json(questionsWithIds);
  } catch (error) {
    logger.error('Error in getQuestionsByRound:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    if (!req.body || !req.body.teamName || !Array.isArray(req.body.answers) || !req.body.round) {
      console.log("SOmething went wrong")
      return res.status(400).json({ message: "Invalid request body format" });
    }

    let score = 0;
    let correctAnswers = [];
    for (let answer of req.body.answers) {
      if (!answer.questionId || !answer.choice) {
        return res.status(400).json({ message: "Invalid answer format" });
      }
      const isCorrect = await questionService.checkAnswer(answer.questionId, answer.choice);
      if (isCorrect) {
        score++;
        correctAnswers.push(answer.questionId);
      }
    }

    const updatedTeam = await teamService.updateScore(req.body.teamName, score);

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({
      teamName: updatedTeam.teamName,
      round: req.body.round,
      score: updatedTeam.score,
      correctAnswers: correctAnswers,
      message: `Score updated for round ${req.body.round}. You got ${score} correct answers.`
    });
  } catch (error) {
    logger.error('Error in submitAnswers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getQuestionByDomain = async (req, res) => {
  try {
    const question = await questionService.getQuestionsByDomain(req.params.domain);
    const questionWithId = {
      id: question._id,
      question: question.question,
    };
    res.json(questionWithId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { teamName, questionId, code, language } = req.body;

    if (!teamName || !questionId || !code || !language) {
      console.log("Invalid request body format: ", { teamName, questionId, code, language });
      return res.status(400).json({ message: "Invalid request body format" });
    }

    console.log(`Received code submission for team: ${teamName}, question: ${questionId}, language: ${language}`);

    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Run code and check test cases
    const result = await questionService.runCodeAndCheckTestCases(code, language, question.testCases);

    let scoreIncrement = 0;
    let efficiencyScore = 0;
    const totalTests = question.testCases.length;
    const testsPassed = result.testResults.filter(test => test.passed).length;

    // Award score based on the number of passed tests
    if (testsPassed === totalTests) {
      // Full score if all tests pass
      scoreIncrement = 30;
      efficiencyScore = calculateEfficiencyScore(result.timeTaken, result.memoryUsed);
      console.log(`All tests passed. Updating score for team: ${teamName}`);
    } else if (testsPassed > 0) {
      // Partial score for partial test passing
      scoreIncrement = Math.floor((testsPassed / totalTests) * 20);  // Award points based on test completion
      efficiencyScore = calculateEfficiencyScore(result.timeTaken, result.memoryUsed);
      console.log(`Partial tests passed. Awarding partial score for team: ${teamName}`);
    }

    // Update the score with efficiency factored in
    const totalScoreIncrement = scoreIncrement + efficiencyScore;

    // Update team score
    let updatedTeam = await teamService.updateScore(teamName, totalScoreIncrement);
    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log(`Sending response for team: ${teamName}`);
    res.json({
      teamName,
      round: 2,
      allTestsPassed: testsPassed === totalTests,
      testResults: result.testResults,
      scoreUpdated: testsPassed > 0,
      score: updatedTeam.score,
      efficiencyScore,
      message: testsPassed === totalTests 
        ? "All test cases passed. Full score awarded."
        : `Partial success. Awarded ${totalScoreIncrement} points.`
    });

  } catch (error) {
    logger.error('Error in submitCode:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const calculateEfficiencyScore = (timeTaken, memoryUsed) => {
  let efficiencyScore = 0;

  // Example scoring based on time and memory usage
  if (timeTaken <= 1000 && memoryUsed <= 64 * 1024) {
    efficiencyScore = 10; // Full points for high efficiency
  } else if (timeTaken <= 2000 && memoryUsed <= 128 * 1024) {
    efficiencyScore = 5; // Partial points for moderate efficiency
  } else {
    efficiencyScore = 0; // No points for inefficient code
  }

  return efficiencyScore;
};

exports.getAllQuestionsRound1 = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestionsRound1();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuestionsRound2 = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestionsRound2();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomQuestionRound3 = async (req, res) => {
  try {
    const question = await questionService.getRandomQuestionRound3();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};