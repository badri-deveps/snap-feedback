require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
