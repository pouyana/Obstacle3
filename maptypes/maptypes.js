exports.all = function(data) {
  return new Promise(function(resolve) {
    // TODO maybe put this in DB

    var mapTypes = {
      maptypes: [{
        name: "Random Map",
        maptype: "random"
      }, {
        name: "Elevation Map",
        maptype: "elevation"
      }, {
        name: "Wind Map",
        maptype: "wind"
      }]
    }

    resolve(mapTypes);
  });
}
