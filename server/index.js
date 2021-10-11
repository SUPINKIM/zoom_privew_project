const express = require('express');
const cors = require('cors');
const app = express();

const content = require('./content');
const bestJson = require('./json/best.json');

const whitelist = 'http://localhost:1337';
const corsOption = {
  origin: whitelist,
  credentials: true,
};

app.use(cors(corsOption));
app.use('/content', content);

app.get('/api/best', cors(), (req, res) => {
  res.json({ state: 200, data: bestJson });
});

app.listen(3000, function () {
  console.log('start server...in 3000 port');
});
