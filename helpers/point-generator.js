/**
 * Generate the points for the given latitude and longtitude.
 * @param lat Latitude of the drone
 * @param lon Longitutde of the drone
 * @param accuracy The accuracy needed.
 * @param width Width of the area we need data from
 */
exports.pointGenerator = function(lat, lon, accuracy, width) {
  var edges = [];
  var steps = width / accuracy;
  var combinations = [
    [0, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [-1, -1],
    [-1, 1]
  ];
  combinations.forEach(fucntion(element) {
    element[0] = element[0] * steps;
    element[1] = element[1] * steps;
  });
  console.log(combinations);
}

var generateEdges = function(lat, lon, offsetEast, offsetNorth) {
  var earthRadius = 6378137.0;
  var dLat = offsetEast / earthRadius;
  var dLon = offsetNorth / earthRadius * Math.cos((Math.PI * lat) / 180);
  var newLat = lat + dLat * 180 / Math.PI;
  var newLon = lon + dLon * 180 / Math.PI;
  return [newLat, newLon];
}
