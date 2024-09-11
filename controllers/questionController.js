const questionService = require('../services/questionService');
const teamService = require('../services/teamService');
const axios = require('axios');

exports.getQuestionsByRound = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByRound(req.params.round);
    const questionsWithIds = questions.map(q => ({
      id: q._id,
      question: q.question,
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
      if (isCorrect) {
        score++;
        correctAnswers.push(answer.questionId);
      }
    }

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
      return res.status(400).json({ message: "Invalid request body format" });
    }

    console.log(`Received code submission for team: ${teamName}, question: ${questionId}, language: ${language}`);

    const question = await questionService.getQuestionById(questionId);
    if (!question) {
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
        return res.status(404).json({ message: "Team not found" });
      }
    } else {
      console.log(`Some tests failed. Getting current score for team: ${teamName}`);
      updatedTeam = await teamService.getTeamByName(teamName);
      if (!updatedTeam) {
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
    console.error("Error in submitCode:", error);
    res.status(500).json({ message: "Error processing code submission: " + error.message });
  }
};

async function runCodeWithPiston(code, language, input) {
  const pistonUrl = 'https://emkc.org/api/v2/piston/execute';
  const languageMapping = {
    'python': 'python3',
    'javascript': 'node',
    'java': 'java',
    'c': 'gcc',
    'cpp': 'g++'
  };

  const pistonLanguage = languageMapping[language.toLowerCase()];
  if (!pistonLanguage) throw new Error('Unsupported language');

  try {
    const response = await axios.post(pistonUrl, {
      language: pistonLanguage,
      source_code: code,
      stdin: input
    });

    if (response.data && response.data.run) {
      return response.data.run.output;
    } else {
      throw new Error('Invalid response from Piston API');
    }
  } catch (error) {
    console.error("Error calling Piston API:", error);
    throw new Error('Failed to execute code with Piston API');
  }
}

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