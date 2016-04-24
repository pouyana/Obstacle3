/**
 * Generates the Maps.
 */
var express = require('express');
var app = express.Router();
var validate = require('jsonschema').validate;
var generateMapSchema = require('../schemas/generate-map.js');
var log4js = require('log4js');
var logger = log4js.getLogger('generateMap');

var randomLayer = require('../layers/random.js');
var elevationLayer = require('../layers/elevation.js');

app.use(function(req, res, next) {
  var validation = validate(req.body, generateMapSchema);
  if (validation.errors.length != 0) {
    logger.warn(validation);
    return res.status(400).json({
      ValidationErrors: validation.errors.reduce(function(previousValue, currentValue, currentIndex, array) {
        return currentValue.property.substr(9) + ' (' + currentValue.instance + ') ' + currentValue.message;
      })
    });
  }
  next();
})

app.post('/random', function(req, res, next) {
  var params = req.body;
  randomLayer.generate(params).then(function(data) {
    console.log(data);
    res.json({
      accuracy: params.accuracy || 1,
      classification: data.classification,
      lat: data.lat,
      lon: data.lon,
      request: params
    });
  })
})
app.post('/elevation', function(req, res, next) {
  var params = req.body;
  elevationLayer.generate(params).then(function(data) {
    res.json({
      accuracy: params.accuracy,
      classification: data.classification,
      lat: params.flightarea.lat,
      lon: params.flightarea.lon,
      request: params,
    });
  })
})

app.use(function(req, res, next) {
  res.status(400).json('Layer Type Not found');
})

module.exports = app;
