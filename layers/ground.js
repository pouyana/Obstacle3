var log4js = require('log4js');
var logger = log4js.getLogger('groundLayer');
var mongoose = require('mongoose');
var Obstacle = require('../models/obstacle.js');

exports.generate = function(data) {
  logger.debug(data);

  Obstacle.find({}, function(err, docs) {
    if (err) return next(err);
    logger.debug(docs);
  });

  var map = [];
  return map;
}
