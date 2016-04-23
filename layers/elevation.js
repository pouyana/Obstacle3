var log4js = require('log4js');
var request = require('request');
var logger = log4js.getLogger('elevationLayer');
var pointGenerator = require('../helpers/point-generator.js').pointGenerator;

exports.generate = function(data) {
  return new Promise(function(resolve) {
    logger.debug(data);
    var map = pointGenerator(data.flightarea.lat, data.flightarea.long, data.accuracy, data.flightarea.width, data.flightarea["length"]);

    var promises = []
    map.forEach(function(element) {
      element.forEach(function(elem) {
        promises.push(elevationGet(elem[0], elem[1]))
      });
    });

    var c = 0
    Promise.all(promises).then(function(data) {
      for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
          map[i][j].push(data[c]);
          c++
        }
      }
      logger.debug(map);
      resolve(map);
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
          data = JSON.parse(body);
          data = data["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["Elevation"];
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
