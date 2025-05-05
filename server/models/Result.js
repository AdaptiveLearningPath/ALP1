const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: String, // optional: could be redundant if using childId
  studentName: String,
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // store reference to child user
  parentId: String, // helpful for mapping results to parents
  game: String,
  subject: String,
  quizId: String,
  score: Number,
  total: Number,
  correctAnswers: Number,
  attemptedOn: Date,
  questions: [
    {
      question_number: Number,
      question: String,
      options: [String],
      selectedOption: String,
      answer: String,
      difficulty: String,
      isCorrect: Boolean
    }
  ]
});

module.exports = mongoose.model('Result', resultSchema, 'quizResults');
