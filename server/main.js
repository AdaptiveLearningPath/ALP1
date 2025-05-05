const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios'); // ✅ Import axios for making HTTP requests to the Python model
const predictRoute = require('./routes/predictRoute');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');
const authRoutes = require('./routes/auth'); // ✅ Add this line

app.use('/api', predictRoute); // Now accessible as POST /api/predict
app.use('/api/quizzes', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/auth', authRoutes); 

// New endpoint to forward predictions to Python model
app.post('/api/predict', async (req, res) => {
  try {
    const { landmarks } = req.body;  // Get landmarks from the request body

    // Make a POST request to the Python model API
    const response = await axios.post('http://localhost:5001/predict', { landmarks });
    
    // Send the response from the Python model to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error calling the Python model:", error);
    res.status(500).send("Error making prediction");
  }
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
