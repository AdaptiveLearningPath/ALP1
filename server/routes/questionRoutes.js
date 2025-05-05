const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET 5 random questions based on quizId and difficulty level
router.get('/:quizId/:level', async (req, res) => {
  const { quizId, level } = req.params;

  try {
    // Validate quizId
    if (!['quiz1', 'quiz2'].includes(quizId)) {
      return res.status(400).json({ error: 'Invalid quizId provided' });
    }

    // Validate and format difficulty
    const validLevels = ['easy', 'medium', 'hard'];
    const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

    if (!validLevels.includes(level.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid difficulty level provided' });
    }

    // Fetch 5 random questions
    const questions = await Question.aggregate([
      { $match: { quiz_id: quizId, difficulty: formattedLevel } },
      { $sample: { size: 5 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for the given quiz and level' });
    }

    res.json(questions);
  } catch (error) {
    console.error('Error fetching filtered questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

module.exports = router;