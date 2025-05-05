const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// Save quiz result
router.post('/submit', async (req, res) => {
  const { studentId, studentName, game, subject, quizId, score, total, correctAnswers, attemptedOn, questions } = req.body;

  if (!studentId || !studentName) {
    return res.status(400).json({ error: 'Missing studentId or studentName' });
  }

  try {
    const result = new Result({
      studentId,
      studentName,
      game,
      subject,
      quizId,
      score,
      total,
      correctAnswers,
      attemptedOn,
      questions
    });

    await result.save();
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;