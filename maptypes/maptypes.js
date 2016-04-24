exports.generate = function(data) {
  return new Promise(function(resolve) {

    mapTypes = [];
    var randomMap = {};
    randomMap.name = "Random Map";
    randomMap.maptype = "random";

    var elevationMap = {};
    elevationMap.name = "Elevation Map";
    elevationMap.maptype = "elevation";

    var windMap = {};
    windMap.name = "Wind Map";
    windMap.maptype = "wind";

    mapTypes.push(randomMap);
    mapTypes.push(elevationMap);
    mapTypes.push(windMap);
    resolve(mapTypes);
  });
}
