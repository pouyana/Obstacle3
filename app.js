'use strict';
var config = require('./config.js');
var log4js = require('log4js');
log4js.configure(config.log4js);
var logger = log4js.getLogger();
var express = require('express');
var app = express();
app.disable('x-powered-by');
app.set('json spaces', 2);
var compression = require('compression');
app.use(compression());
var bodyParser = require('body-parser');

var sampleLayer = require('./layers/sample.js');

var api = express.Router();
api.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Cache-Control', 'no-cache');
  logger.debug('API Request: %s %s', req.method, req.originalUrl);
  return next();
});
api.use(bodyParser.json());

api.get('/generate-map/:layerName', function(req, res, next) {
  if (req.params.layerName == 'sample')
    res.json(sampleLayer.generate(res.body));
  else {
    res.status(400).json('Layer Not found');
  }
})

api.use(function(req, res) {
  logger.warn('%s %s not found', req.method, req.originalUrl);
  res.status(404).json('Not found');
})

api.use(function(err, req, res, next) {
  logger.error(err.stack);
  if (!res.headersSent)
    res.status(500).json('Internal Server Error');
})

app.use('/api', api);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res) {
  logger.warn('%s %s not found', req.method, req.originalUrl);
  res.status(404).send('Not found');
})

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  if (!res.headersSent)
    res.status(500).send('Internal Server Error');
})

app.listen(config.http.port, function() {
  logger.debug('Listening on %s:%d', config.http.ip, config.http.port);
});
