'use strict';
var config = require('./config.js');
var log4js = require('log4js');
log4js.configure(config.log4js);
var logger = log4js.getLogger();
var express = require('express');
var debug = require("debug");
var app = express();
app.disable('x-powered-by');
//app.set('json spaces', 2);
var compression = require('compression');
app.use(compression());
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect(config.mongodb.url, config.mongodb.config, function(err) {
  if (err) logger.error(err.stack);
});
mongoose.set('debug', true);
var db = mongoose.connection;
db.once('open', function() {
  logger.debug('Opened mongoose');
});
db.once('close', function() {
  logger.debug('Closed mongoose');
});
db.on('connected', function() {
  logger.debug('Connected to MongoDB');
});
db.on('error', function(err) {
  logger.error(err.stack);
});
db.on('disconnected', function() {
  logger.debug('Disconnected to MongoDB');
});

var generateMapRouter = require("./maps/generate-map.js");
var mapTypes = require("./maps/maptypes.js");

var api = express.Router();
api.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  logger.debug('API Request: %s %s', req.method, req.originalUrl);
  return next();
});

api.use(bodyParser.json());
api.use(function(err, req, res, next) {
  res.status(400).json('Invalid JSON');
})

/**
 * Returns the Map Existing mapTypes, still static.
 */
api.post("/get-maptypes", function(req, res, next) {
  mapTypes.all().then(function(data) {
    res.json({
      maptypes: data
    });
  });
});

api.use('/generate-map', generateMapRouter);

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
