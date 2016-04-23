'use strict';
var config = require('./config.js');
var log4js = require('log4js');
log4js.configure(config.log4js);
var logger = log4js.getLogger();
var express = require('express');
var app = express();
app.disable('x-powered-by');
//app.set('json spaces', 2);
var compression = require('compression');
app.use(compression());
var bodyParser = require('body-parser');
var validate = require('jsonschema').validate;
var generateMapSchema = require('./schemas/generate-map.js');

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

var randomLayer = require('./layers/random.js');
var groundLayer = require('./layers/ground.js');
var elevationLayer = require('./layers/elevation.js');

var landingPosition = require('./landing/position.js');

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

//api.post('/landing/position/add', landingPosition.addPosition);
//api.post('/landing/position/update', landingPosition.updatePosition);
//api.post('/landing/position/remove', landingPosition.removePosition);
//api.post('/landing/position/near', landingPosition.nearestPosition);

api.post('/generate-map/:layerName', function(req, res, next) {
  var params = req.body;
  var validation = validate(params, generateMapSchema);
  if (validation.errors.length != 0) {
    logger.warn(validation);
    return res.status(400).json({
      ValidationErrors: validation.errors.reduce(function(previousValue, currentValue, currentIndex, array) {
        return currentValue.property.substr(9) + ' (' + currentValue.instance + ') ' + currentValue.message;
      })
    });
  }

  if (req.params.layerName == 'random') {
    randomLayer.generate(params).then(function(data) {
      res.json({
        accuracy: params.accuracy || 1,
        classification: data,
        request: params
      });
    })
  } else if (req.params.layerName == 'ground') {
    randomLayer.generate(params).then(function(data) {
      res.json({
        accuracy: params.accuracy || 1,
        classification: data
      });
    })
  } else if (req.params.layerName == 'elevation') {
    elevationLayer.generate(params).then(function(data) {
      res.json({
        accuracy: 1,
        classification: data
      });
    })
  } else {
    res.status(400).json('Layer Type Not found');
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
