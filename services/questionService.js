const Question = require('../models/Question');
const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// You might need to install and import a code execution library
// For example: const { runCode } = require('some-code-execution-library');

exports.getQuestionsByRound = async (round) => {
  return await Question.find({ round });
};

exports.getQuestionById = async (questionId) => {
  return await Question.findById(questionId);
};  

exports.getQuestionsByDomain = async (domain) => {
  const questions = await Question.find({ domain });
  return questions[Math.floor(Math.random() * questions.length)];
};

exports.checkAnswer = async (questionId, submittedAnswer) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      console.log(`Question not found for ID: ${questionId}`);
      return false;
    }
    
    console.log(`Checking answer for question ${questionId}`);
    console.log(`Question object:`, question);
    
    if (!question.correctAnswer) {
      console.log(`Correct answer is undefined for question ${questionId}`);
      return false;
    }
    
    console.log(`Correct answer: "${question.correctAnswer}"`);
    console.log(`Submitted answer: "${submittedAnswer}"`);
    
    // Ensure both answers are strings and trim whitespace
    const correctAnswerStr = String(question.correctAnswer).trim().toLowerCase();
    const submittedAnswerStr = String(submittedAnswer).trim().toLowerCase();
    
    const isCorrect = correctAnswerStr === submittedAnswerStr;
    
    console.log(`Is correct: ${isCorrect}`);
    
    return isCorrect;
  } catch (error) {
    console.error('Error checking answer:', error);
    return false;
  }
};

exports.getQuestionById = async (questionId) => {
  return await Question.findById(questionId);
};

exports.runCodeAndCheckTestCases = async (code, language, testCases) => {
  let allTestsPassed = true;
  const testResults = [];

  const tempDir = path.join(__dirname, '../temp');
  await fs.mkdir(tempDir, { recursive: true });
  const fileName = `temp_${Date.now()}`;
  const filePath = path.join(tempDir, fileName);

  try {
    await fs.writeFile(`${filePath}.${getFileExtension(language)}`, code);
    console.log(`Code file created: ${filePath}.${getFileExtension(language)}`);

    for (const [index, testCase] of testCases.entries()) {
      try {
        console.log(`Running test case ${index + 1}`);
        const output = await runCode(filePath, language, testCase.input);
        console.log(`Output: ${output}`);
        
        // Convert both output and expected output to numbers and compare
        const numericOutput = Number(output.trim());
        const numericExpected = Number(testCase.expectedOutput.trim());
        const passed = !isNaN(numericOutput) && !isNaN(numericExpected) && numericOutput === numericExpected;
        
        console.log(`Test case ${index + 1} result: ${passed ? 'Passed' : 'Failed'}`);
        testResults.push({ 
          input: testCase.input, 
          expected: testCase.output,
          actual: output.trim(), 
          passed 
        });

        if (!passed) allTestsPassed = false;
      } catch (error) {
        console.error(`Error running test case ${index + 1}:`, error);
        allTestsPassed = false;
        testResults.push({ 
          input: testCase.input, 
          expected: testCase.output,
          actual: "Error: " + error.message, 
          passed: false 
        });
      }
    }
  } finally {
    // Clean up temporary files
    const extensions = ['.c', '.cpp', '.java', '.py', '.js', '.class', '.out'];
    for (const ext of extensions) {
      try {
        await fs.unlink(`${filePath}${ext}`);
        console.log(`Deleted temporary file: ${filePath}${ext}`);
      } catch (error) {
        // Ignore errors if file doesn't exist
      }
    }
  }

  console.log(`All tests passed: ${allTestsPassed}`);
  return { allTestsPassed, testResults };
};

function getFileExtension(language) {
  switch (language.toLowerCase()) {
    case 'c': return 'c';
    case 'cpp': return 'cpp';
    case 'java': return 'java';
    case 'python': return 'py';
    case 'javascript': return 'js';
    default: throw new Error('Unsupported language');
  }
}

async function runCode(filePath, language, input) {
  const commands = {
    c: [`gcc`, [`${filePath}.c`, `-o`, `${filePath}.out`], `${filePath}.out`],
    cpp: [`g++`, [`${filePath}.cpp`, `-o`, `${filePath}.out`], `${filePath}.out`],
    java: [`javac`, [`${filePath}.java`], `java`, [`-cp`, path.dirname(filePath), path.basename(filePath)]],
    python: [`python`, [`${filePath}.py`]],
    javascript: [`node`, [`${filePath}.js`]]
  };

  const [compiler, compilerArgs, runner, runnerArgs] = commands[language.toLowerCase()];
  if (!compiler) throw new Error('Unsupported language');

  console.log(`Compiling with command: ${compiler} ${compilerArgs.join(' ')}`);

  return new Promise((resolve, reject) => {
    let output = '';
    let errorOutput = '';

    const compile = spawn(compiler, compilerArgs);

    compile.stdout.on('data', (data) => {
      console.log(`Compile stdout: ${data}`);
    });

    compile.stderr.on('data', (data) => {
      console.error(`Compile stderr: ${data}`);
      errorOutput += data;
    });

    compile.on('close', (code) => {
      if (code !== 0) {
        console.error(`Compilation failed with code ${code}`);
        return reject(new Error(`Compilation failed: ${errorOutput}`));
      }

      console.log(`Running with command: ${runner || compiler} ${(runnerArgs || compilerArgs).join(' ')}`);

      const run = spawn(runner || compiler, runnerArgs || compilerArgs);

      run.stdin.write(input);
      run.stdin.end();

      run.stdout.on('data', (data) => {
        console.log(`Run stdout: ${data}`);
        output += data;
      });

      run.stderr.on('data', (data) => {
        console.error(`Run stderr: ${data}`);
        errorOutput += data;
      });

      run.on('close', (code) => {
        if (code !== 0) {
          console.error(`Execution failed with code ${code}`);
          reject(new Error(`Execution failed: ${errorOutput}`));
        } else {
          resolve(output);
        }
      });
    });
  });
}

exports.getAllQuestionsRound1 = async () => {
  return await Question.find({ round: 1 });
};

exports.getAllQuestionsRound2 = async () => {
  return await Question.find({ round: 2 });
};

exports.getRandomQuestionRound3 = async (domain) => {
  const questions = await Question.find({ round: 3, domain });
  return questions[Math.floor(Math.random() * questions.length)];
};

exports.updateQuestionsRound1 = async (questions) => {
  const updatedQuestions = await Promise.all(
    questions.map(async (q) => {
      return await Question.findByIdAndUpdate(q._id, q, { new: true });
    })
  );
  return updatedQuestions;
};

exports.updateQuestionsRound2 = async (questions) => {
  const updatedQuestions = await Promise.all(
    questions.map(async (q) => {
      return await Question.findByIdAndUpdate(q._id, q, { new: true });
    })
  );
  return updatedQuestions;
};

exports.updateQuestionsRound3 = async (questions) => {
  const updatedQuestions = await Promise.all(
    questions.map(async (q) => {
      return await Question.findByIdAndUpdate(q._id, q, { new: true });
    })
  );
  return updatedQuestions;
};