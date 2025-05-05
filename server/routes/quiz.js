const express = require('express');
const router = express.Router();
const transformerController = require('../controllers/transformerController');

// Route to predict learning path based on emotions and score
router.post('/transformer/predict-path', transformerController.predictPath);

// Route to fetch questions based on predicted path
router.get('/questions/by-path', transformerController.getQuestionsByPath);

module.exports = router; 