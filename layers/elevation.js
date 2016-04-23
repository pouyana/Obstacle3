var log4js = require('log4js');
var logger = log4js.getLogger('elevationLayer');
var pointGenerator = require('../helpers/point-generator.js').pointGenerator;

exports.generate = function(data) {
  logger.debug(data);
  pointGenerator(data.flightarea.lat, data.flightarea.long, data.accuracy, data.flightarea.width);
  var map = [];
  var accuracy = data.accuracy || 1;
  for (var i = 0; i < data.flightarea['length']; i += accuracy) {
    map.push([]);
    for (var j = 0; j < data.flightarea.width; j += accuracy) {
      map[i/accuracy].push(Math.floor(Math.random()*16));
    }
  }
  return map;
}
