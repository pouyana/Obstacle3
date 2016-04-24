var log4js = require('log4js');
var logger = log4js.getLogger('randomLayer');

exports.generate = function(data) {
  return new Promise(function(resolve) {
    logger.debug(data);
    map = {};
    map.classification = [];
    var accuracy = data.accuracy || 1;
    for (var i = 0; i < data.flightarea['length']; i += accuracy) {
      map.classification.push([]);
      for (var j = 0; j < data.flightarea.width; j += accuracy) {
        map.classification[i / accuracy].push(Math.floor(Math.random() * 16));
      }
    }
    var latLon = generateEdges(data.flightarea.lat, data.flightarea.lon, data.flightarea.width, data.flightarea['length']);
    map.lat = latLon[0];
    map.lon = latLon[1];
    resolve(map);
  })
}

/**
 *
 */
var generateEdges = function(lat, lon, offsetEast, offsetNorth) {
  var earthRadius = 6378137.0;
  var dLat = offsetEast / earthRadius;
  var dLon = offsetNorth / earthRadius * Math.cos((Math.PI * lon) / 180);
  var newLat = lat + dLat * 180 / Math.PI;
  var newLon = lon + dLon * 180 / Math.PI;
  return [newLat, newLon];
}
