'use strict';

const express = require('express');
const app = express();

//app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
