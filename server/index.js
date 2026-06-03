require('dotenv').config();
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'NewSetu API is running' }));
});

const PORT = process.env.PORT || 5000;
console.log('PORT from env:', process.env.PORT, '| using:', PORT);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
