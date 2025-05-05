const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const axios = require('axios');

router.post('/predict', async (req, res) => {
  try {
    const { emotions } = req.body;

    // Send emotions to Python backend for prediction
    const predictionResponse = await axios.post('http://localhost:5001/predict', { emotions });
    const difficultyPredictions = predictionResponse.data.predictions;

    // Fetch questions based on predicted difficulties
    const questions = await Promise.all(
      difficultyPredictions.map(async (difficulty) => {
        const questionsForDifficulty = await Question.aggregate([
          { $match: { difficulty: difficulty } },
          { $sample: { size: 1 } }
        ]);
        return questionsForDifficulty[0];
      })
    );

    res.json({
      predictions: difficultyPredictions,
      questions: questions
    });
  } catch (error) {
    console.error('Error in prediction route:', error);
    res.status(500).json({ error: 'Failed to process prediction and fetch questions' });
  }
});

module.exports = router;
