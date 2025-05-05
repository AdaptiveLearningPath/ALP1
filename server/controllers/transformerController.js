const axios = require('axios');
const Question = require('../models/Question');

// Predict learning path based on emotions and score
exports.predictPath = async (req, res) => {
  try {
    const { score, emotionProbabilities } = req.body;

    // Convert emotion probabilities to array format expected by transformer
    const emotionArray = [
      emotionProbabilities.angry || 0,
      emotionProbabilities.happy || 0,
      emotionProbabilities.neutral || 0,
      emotionProbabilities.sad || 0,
      emotionProbabilities.surprise || 0
    ];

    // Call Python transformer service
    const response = await axios.post('http://localhost:5001/predict', {
      emotions: [...emotionArray, score] // Combine emotions and score
    });

    res.json({
      path: response.data.predictions[0], // First item contains the difficulty path
      status: 'success'
    });
  } catch (error) {
    console.error('Error predicting path:', error);
    res.status(500).json({ error: 'Failed to predict learning path' });
  }
};

// Fetch questions based on predicted path
exports.getQuestionsByPath = async (req, res) => {
  try {
    const { path } = req.query;
    const difficulties = path.split(',').map(Number);

    // Fetch one question for each difficulty level in the path
    const questions = await Promise.all(
      difficulties.map(async (difficulty) => {
        // Get a random question matching the difficulty
        const [question] = await Question.aggregate([
          { $match: { difficulty } },
          { $sample: { size: 1 } }
        ]);
        return question;
      })
    );

    // Filter out any null values in case some difficulties didn't match
    const validQuestions = questions.filter(q => q);

    if (validQuestions.length !== difficulties.length) {
      console.warn('Some difficulties did not match available questions');
    }

    res.json({
      questions: validQuestions,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}; 