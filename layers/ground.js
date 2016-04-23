var log4js = require('log4js');
var logger = log4js.getLogger('groundLayer');
var mongoose = require('mongoose');
var Obstacle = require('../models/obstacle.js');
var geolib = require('geolib');

exports.generate = function(data) {
  return new Promise(function (resolve) {
    logger.debug(data);
    var flightarea = data.flightarea;

    var points = {
      ul: {
        latitude: flightarea.lat,
        longitude: flightarea.long
      },
      ur: geolib.computeDestinationPoint(flightarea.lat, flightarea.long, 1, 90),
      //lr: geolib.computeDestinationPoint(flightarea.lat, flightarea.long, 1, 0),
      //ll: geolib.computeDestinationPoint(flightarea.lat, flightarea.long, 1, 90)
    }

    logger.debug(points);

    /*Obstacle.find({
      $geoWithin: {
        $polygon: [
          [points.ul.latitude, points.ul.longitude],
          [points.ur.latitude, points.ur.longitude],
          [points.lr.latitude, points.lr.longitude],
          [points.ll.latitude, points.ll.longitude],
          [points.ul.latitude, points.ul.longitude]
        ]
      }
    }, function(err, docs) {
      if (err) return next(err);
      logger.debug(docs);
    });*/

    var map = [];
    resolve(map);
  })
}
