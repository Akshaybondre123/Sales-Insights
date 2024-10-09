const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const transactionRoutes = require('./routes/transactionRoutes'); // Ensure this path is correct
const Transaction = require('./models/Transaction'); // Import the Transaction model
const cors = require('cors'); // Optional: for enabling CORS if needed

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    mongoose.set('strictQuery', true);
  })
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/transactions', transactionRoutes);


app.get('/api/init', async (req, res) => {
  try {
    const { data } = await axios.get(process.env.THIRD_PARTY_API_URL);
    
    
    if (Array.isArray(data) && data.length > 0) {
      await Transaction.insertMany(data); 
      res.status(200).json({ message: 'Database initialized successfully' });
    } else {
      res.status(400).json({ message: 'No valid data received from API' });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Error initializing database', error });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
