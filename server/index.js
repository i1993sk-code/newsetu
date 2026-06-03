require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
  console.log('Request:', req.method, req.path);
  next();
});

app.use(cors());
app.use(express.json());

app.get(['/', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'NewSetu API is running' });
});

const providerRoutes = require('./routes/provider');
app.use('/api/provider', providerRoutes);

const PORT = process.env.PORT || 10000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB error:', err.message);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const providerRoutes = require('./routes/provider');
app.use('/api/provider', providerRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
