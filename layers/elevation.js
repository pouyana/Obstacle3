var log4js = require('log4js');
var request = require('request');
var logger = log4js.getLogger('elevationLayer');
var pointGenerator = require('../helpers/point-generator.js').pointGenerator;

var getResult = function(data) {
  return new Promise(function(resolve) {
    var pointMap = pointGenerator(
      data.flightarea.lat,
      data.flightarea.lon,
      data.accuracy,
      data.flightarea.width,
      data.flightarea["length"]
    );
    var result = [];
    console.log("NumberOFServerQueries: " + pointMap.length * pointMap[1].length);
    for (var i = 0; i < pointMap.length; i++) {
      for (var j = 0; j < pointMap[i].length; j++) {
        result.push(fetchElevation(pointMap[i][j][0], pointMap[i][j][1], i, j));
      }
    }
    Promise.all(result).then(function(data) {
      console.log("Download finished");
      resolve(data);
    });
  });

}

var getMaxRowColumns = function(data) {
  var maxRows = 0;
  var maxColumns = 0;
  data.forEach(function(element) {
    if (element.row + 1 > maxRows) {
      maxRows = element.row + 1;
    }
    if (element.column + 1 > maxColumns) {
      maxColumns = element.column + 1;
    }
  });
  return [maxRows, maxColumns];
}


exports.generate = function(data) {
  return new Promise(function(resolve) {
    var result = getResult(data);
    result.then(function(data) {
      var elevations = [];
      for (var i = 0; i < data.length; i++) {
        elevations.push(data[i].elev);
      };
      elevations.sort(function(a, b) {
        return a - b
      });
      var maxElevation = elevations[elevations.length - 1];
      var minElevation = elevations[0];

      var maxData = getMaxRowColumns(data);
      var tableData = {};
      tableData.classification = [];
      var tmpColumn = [];
      for (var i = 0; i < data.length; i = i + maxData[1]) {
        tmpColumn = [];
        for (var j = 0; j < maxData[1]; j++) {
          tmpColumn.push(normalizer(minElevation, maxElevation, data[i + j].elev));
        }
        tableData.classification.push(tmpColumn);
      }
      resolve(tableData);
    });
  });
}

var fetchElevation = function(lat, lon, column, row) {
  var data = {};
  var requestSent = 'http://nationalmap.gov/epqs/pqs.php?x=' + lon + '&y=' + lat + '&units=Meters&output=json';
  return new Promise(function(resolve) {
    request(requestSent, function optionalCallBack(error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          jsonData = JSON.parse(body);
          data.elev = jsonData["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["Elevation"];
        } catch (e) {
          logger.error(e);
        }
      } else {
        logger.error(error.stack, response.statusCode);
      }
      data.row = row;
      data.column = column;
      console.log("Still Downloading");
      resolve(data);
    });
  });
}
var normalizer = function(minValue, maxValue, value) {
  var normalized = ((value - minValue) / (maxValue - minValue));
  normalized = Math.abs(normalized - 1);
  return Math.floor(normalized * 15);
}
