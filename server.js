var express = require('express');
var routes = require('./app');
var bodyParser = require('body-parser');
var config = require('config');

var app = express();
const port = process.env.PORT || config.application_serverport;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(port, function() {
  console.log(`server running on port ${port}`);
});
