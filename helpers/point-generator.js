var log4js = require('log4js');
var logger = log4js.getLogger('pointGenerator');
/**
 * Generate the points for the given latitude and longtitude.
 * @param lat Latitude of the drone
 * @param lon Longitutde of the drone
 * @param accuracy The accuracy needed.
 * @param width Width of the area we need data from
 */
exports.pointGenerator = function(lat, lon, accuracy, width) {
  var edges = [];
  var stepSize = width / accuracy;
  var combinations = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1]
  ];
  combinations.forEach(function(element) {
    element[0] = element[0] * width;
    element[1] = element[1] * width;
  });
  var counterLon = 0;
  var counterLat = 0;
  combinations.forEach(function(element) {
    var counterLat = 0;
    while (Math.abs(counterLat) < Math.abs(element[0])) {
      counterLat = counterLat + getSign(element[0]) * stepSize;
      counterLon = 0;
      tmpLine = [];
      while (Math.abs(counterLon) < Math.abs(element[1])) {
        counterLon = counterLon + getSign(element[1]) * stepSize;
        tmpEdges = generateEdges(lat, lon, counterLat, counterLon);
        tmpLine.push(tmpEdges);
      }
      edges.push(tmpLine);
    }
  });
  logger.debug(edges);
}

var getSign = function(number) {
  if (number > 0) {
    return 1;
  } else if (number < 0) {
    return -1;
  } else {
    return 0;
  }
}

var generateEdges = function(lat, lon, offsetEast, offsetNorth) {
  var earthRadius = 6378137.0;
  var dLat = offsetEast / earthRadius;
  var dLon = offsetNorth / earthRadius * Math.cos((Math.PI * lon) / 180);
  var newLat = lat + dLat * 180 / Math.PI;
  var newLon = lon + dLon * 180 / Math.PI;
  return [newLat, newLon];
}
