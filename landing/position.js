var log4js = require('log4js');
var logger = log4js.getLogger('landingPosition');
var mongoose = require('mongoose');
var Position = require('../models/position.js');

var formatValidationErrors = function(errors) {
  var errs = [];
  Object.keys(errors.errors).forEach(function(key) {
    errs.push(errors.errors[key].message);
  });
  return {
    validatonErrors: errs
  };
}

module.addPosition = function (req, res, next) {
  var body = req.body;
  body._id = mongoose.Types.ObjectId();
  var formatValidationErrors = function(errors) {
    var errs = [];
    Object.keys(errors.errors).forEach(function(key) {
      errs.push(errors.errors[key].message);
    });
    return {
      validatonErrors: errs
    };
  }
  var position = new Position(body);
  var errors = position.validateSync();
  if (errors) res.status(400).json(formatValidationErrors(errors))
  position.save(function(err, result) {
    if (err) return next(err);
    res.json({
      insertedId: result._id
    });
  });
}

module.updatePosition = function (req, res, next) {
  var body = req.body;
  var formatValidationErrors = function(errors) {
    var errs = [];
    Object.keys(errors.errors).forEach(function(key) {
      errs.push(errors.errors[key].message);
    });
    return {
      validatonErrors: errs
    };
  }
  var position = new Position(body);
  var errors = position.validateSync();
  if (errors) res.status(400).json(formatValidationErrors(errors))
  position.save(function(err, result) {
    if (err) return next(err);
    res.json({status: 'ok'});
  });
}

module.removePosition = function (req, res, next) {
  var body = req.body;
  var position = new Position(body);
  position.remove(function(err, result) {
    if (err) return next(err);
    res.json({status: 'ok'});
  });
}

module.nearestPosition = function (req, res, next) {

}
