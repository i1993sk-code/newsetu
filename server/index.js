process.on('unhandledRejection', (err) => console.log('UNHANDLED REJECTION:', err.message));
process.on('uncaughtException', (err) => console.log('UNCAUGHT EXCEPTION:', err.message));

require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

app.get(['/', '/api/health'], (req, res) => {
  res.json({ status: 'ok', message: 'NewSetu API is running' });
});

const providerRoutes = require('./routes/provider');
app.use('/api/provider', providerRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const server = http.createServer(app);

server.on('error', (err) => {
  console.log('SERVER ERROR:', err.message, err.code);
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`Server listening: ${JSON.stringify(addr)}`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => console.log('Alive...'), 30000);
