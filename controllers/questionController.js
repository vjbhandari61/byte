const questionService = require('../services/questionService');
const teamService = require('../services/teamService');

exports.getQuestionsByRound = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByRound(req.params.round);
    // Send questions with their IDs
    const questionsWithIds = questions.map(q => ({
      id: q._id,
      question: q.question,
      // Include other necessary fields, but not the answer
    }));
    res.json(questionsWithIds);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    if (!req.body || !req.body.teamName || !Array.isArray(req.body.answers) || !req.body.round) {
      return res.status(400).json({ message: "Invalid request body format" });
    }

    let score = 0;
    let correctAnswers = [];
    for (let answer of req.body.answers) {
      if (!answer.questionId || !answer.answer) {
        return res.status(400).json({ message: "Invalid answer format" });
      }
      const isCorrect = await questionService.checkAnswer(answer.questionId, answer.answer);
      console.log(`Round: ${req.body.round}, Question ID: ${answer.questionId}, Answer: ${answer.answer}, Correct: ${isCorrect}`);
      if (isCorrect) {
        score++;
        correctAnswers.push(answer.questionId);
      }
    }

    console.log(`Team: ${req.body.teamName}, Round: ${req.body.round}, Total Score: ${score}`);

    const updatedTeam = await teamService.updateScore(req.body.teamName, score, req.body.round);

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
    console.error("Error in submitAnswers:", error);
    res.status(500).json({ message: "Error processing answers: " + error.message });
  }
};

exports.getQuestionByDomain = async (req, res) => {
  try {
    const question = await questionService.getQuestionsByDomain(req.params.domain);
    // Send question with its ID
    const questionWithId = {
      id: question._id,
      question: question.question,
      // Include other necessary fields, but not the answer
    };
    res.json(questionWithId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.submitCode = async (req, res) => {
  // Implement code submission logic here
  res.json({ message: 'Code submission endpoint' });
};

exports.submitAnswersRound2 = async (req, res) => {
  try {
    const { teamName, questionId, code, language } = req.body;

    if (!teamName || !questionId || !code || !language) {
      return res.status(400).json({ message: "Invalid request body format" });
    }

    console.log(`Received submission for team: ${teamName}, question: ${questionId}, language: ${language}`);

    const question = await questionService.getQuestionById(questionId);
    if (!question) {
      console.log(`Question not found: ${questionId}`);
      return res.status(404).json({ message: "Question not found" });
    }

    console.log(`Running code and checking test cases for question: ${questionId}`);
    const result = await questionService.runCodeAndCheckTestCases(code, language, question.testCases);

    let scoreIncrement = 0;
    let updatedTeam = null;
    if (result.allTestsPassed) {
      scoreIncrement = 1;
      console.log(`All tests passed. Updating score for team: ${teamName}`);
      updatedTeam = await teamService.updateScore(teamName, scoreIncrement, 2);
      if (!updatedTeam) {
        console.log(`Team not found: ${teamName}`);
        return res.status(404).json({ message: "Team not found" });
      }
    } else {
      console.log(`Some tests failed. Getting current score for team: ${teamName}`);
      updatedTeam = await teamService.getTeamByName(teamName);
      if (!updatedTeam) {
        console.log(`Team not found: ${teamName}`);
        return res.status(404).json({ message: "Team not found" });
      }
    }

    console.log(`Sending response for team: ${teamName}`);
    res.json({
      teamName,
      round: 2,
      allTestsPassed: result.allTestsPassed,
      testResults: result.testResults,
      scoreUpdated: result.allTestsPassed,
      score: updatedTeam.score,
      roundScore: updatedTeam.roundScores[2] || 0,
      message: result.allTestsPassed ? "All test cases passed. Score updated." : "Some test cases failed. No score added."
    });
  } catch (error) {
    console.error("Error in submitAnswersRound2:", error);
    res.status(500).json({ message: "Error processing code submission: " + error.message });
  }
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
        const { domain } = req.query;
        const question = await questionService.getRandomQuestionRound3(domain);
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitRound1 = async (req, res) => {
    // ... existing code ...
};

exports.submitRound2 = async (req, res) => {
    // ... existing code ...
};

exports.updateQuestionsRound1 = async (req, res) => {
    try {
        const updatedQuestions = await questionService.updateQuestionsRound1(req.body);
        res.json(updatedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateQuestionsRound2 = async (req, res) => {
    try {
        const updatedQuestions = await questionService.updateQuestionsRound2(req.body);
        res.json(updatedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateQuestionsRound3 = async (req, res) => {
    try {
        const updatedQuestions = await questionService.updateQuestionsRound3(req.body);
        res.json(updatedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};