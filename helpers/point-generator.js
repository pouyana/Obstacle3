var log4js = require('log4js');
var logger = log4js.getLogger('pointGenerator');

exports.pointGenerator = function(lat, lon, accuracy, width, height) {
  var latCounter = 0;
  var lonCounter = 0;
  var allPoints = [];
  while (latCounter < height) {
    lonCounter = 0;
    var row = [];
    while (lonCounter < width) {
      row.push(generateEdges(lat, lon, latCounter, lonCounter));
      lonCounter = lonCounter + accuracy;
    }
    latCounter = accuracy + latCounter;
    allPoints.push(row);
  }
  return allPoints;
}

var generateEdges = function(lat, lon, offsetEast, offsetNorth) {
  var earthRadius = 6378137.0;
  var dLat = offsetEast / earthRadius;
  var dLon = offsetNorth / earthRadius * Math.cos((Math.PI * lon) / 180);
  var newLat = lat + dLat * 180 / Math.PI;
  var newLon = lon + dLon * 180 / Math.PI;
  return [newLat, newLon];
}
