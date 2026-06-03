require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NewSetu API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NewSetu API is running' });
});

const PORT = process.env.PORT || 5000;
console.log('PORT from env:', process.env.PORT, '| using:', PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
