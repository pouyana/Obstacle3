var log4js = require('log4js');
var request = require('request');
var logger = log4js.getLogger('elevationLayer');
var pointGenerator = require('../helpers/point-generator.js').pointGenerator;

exports.generate = function(data) {
  return new Promise(function(resolve) {
    var map = pointGenerator(data.flightarea.lat, data.flightarea.lon, data.accuracy, data.flightarea.width, data.flightarea["length"]);

    var promises = []
    map.forEach(function(element) {
      element.forEach(function(elem) {
        promises.push(elevationGet(elem[0], elem[1]))
      });
    });

    var c = 0
    Promise.all(promises).then(function(data) {
      elevations = [];
      data.forEach(function(element) {
        elevations.push(element[2]);
      });
      var sortedData = elevations.sort(function(a, b) {
        return a - b;
      });
      minElevation = elevations[0];
      maxElevation = elevations[elevations.length - 1];
      data.forEach(function(element) {
        element[2] = normalizer(minElevation, maxElevation, element[2]);
      });
      resolve(data);
    });
  });
}

var elevationGet = function(lat, lon) {
  var data = -1;
  var requestSent = 'http://nationalmap.gov/epqs/pqs.php?x=' + lon + '&y=' + lat + '&units=Meters&output=json';
  return new Promise(function(resolve, reject) {
    request(requestSent, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          data = [];
          data[0] = lat;
          data[1] = lon;
          data[2] = JSON.parse(body);
          data[2] = data[2]["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["Elevation"];
        } catch (e) {
          logger.error(e);
        }
      } else {
        logger.error(error.stack, response.statusCode);
      }
      resolve(data);
    });
  });
}

var normalizer = function(minValue, maxValue, value) {
  var normalized = ((value - minValue) / (maxValue - minValue));
  normalized = Math.abs(normalized - 1);
  return Math.floor(normalized * 16);
}
