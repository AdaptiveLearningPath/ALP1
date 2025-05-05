const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  difficulty: {
    type: Number,
    enum: [0, 1, 2], // 0: easy, 1: medium, 2: hard
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

// 'Question' is the model name, 'quizzes' is the collection name
module.exports = mongoose.model('Question', QuestionSchema, 'quizzes');
