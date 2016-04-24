# Obstacle3

Obstacle3 is an App showing different Maps, where a drone can't fly and where it could fly easily.

At the moment there are only the Maps
- random — for testing
- elevation — returning the Elevation based on the API from [nationalmap.gov](http://nationalmap.gov/epqs/)

It was build at the [NASA Spaceapps Challenge](https://2016.spaceappschallenge.org/locations/wuerzburg-germany) 2016 in the Category Don't Crash My Drone.
## [Repo of the Android App](https://github.com/olheimer/ObstacleApp)

The returned Maps are visualized with an App.
Colors symbolize the fly conditions for Drones.

Take a look at the Repo for Screenshots

## Future Work
More maps
- No Fly Zones
- Avation Weather Information [possible API](http://www.aviationweather.gov/dataserver/example?datatype=metar)
- Signal Strength
- Water [possible API](http://waterservices.usgs.gov/rest/IV-Test-Tool.html)
- Power Lines [possible API](https://eia-ms.esri.com/arcgis/rest/services/20151208StateEnergyProfilesMap/MapServer/33)
- Antennas [possible API](http://wireless2.fcc.gov/UlsApp/AsrSearch/asrRegistrationSearch.jsp)

Implementing the REST API directly into the drone

## Useing the API
### Generate a Map

`POST` /api/generate-map/*:layerName*

#### Parameters

- **flightarea** *(required)* — Dimensions of the Flightarea:
  - **lat** *(required)* — Latitude of the upper left corner of the Flightarea
  - **lon** *(required)* — Longitude of the upper left corner of the Flightarea
  - **length** *(required)* — Length of the Flightarea (in m)
  - **width** *(required)* — Width of the Flightarea (in m)
- **drone** — Information about the drone:
  - **mass** — Mass of the drone (in g)
  - **maxSpeed** — Maximum Speed (in m/s)
  - **maxFlightHeight** — 'Maximum flight height over Ground (in m)
- **accuracy** — How detailed the map should be (in m), may not be avalible on all maps, depending on the data. default is 1

#### Return format

- **accuracy** — Because this value could not be the same as requested
- **classification** — Two dimensional Array, 15 is best flight conditions, 0 is can not be accesed

#### Errors

- 400 `"Invalid JSON"`
- 400 `{"ValidationErrors": ["errors"]}`, [more info](schemas/generate-map.js)
- 400 `"Layer Type Not found"`
- 500 `"Internal Server Error"` :(

#### Example

`POST` /api/generate-map/[random](layers/random.js)
```json
{
  "flightarea": {
    "lat": 49.783871,
    "lon": 9.976217,
    "length": 300,
    "width": 300
  },
  "accuracy": 20
}
```

Response:
```json
{
  "accuracy": 20,
  "classification": [
    [13,5,7,12,6,1,13,5,1,1,4,3,6,5,3],
    [0,2,9,1,3,3,2,1,6,10,0,12,14,0,6],
    [8,15,7,1,9,1,12,11,15,2,4,1,5,9,2],
    [0,10,1,11,14,2,10,6,12,11,10,12,4,8,1],
    [4,3,7,12,2,8,10,2,10,3,15,13,15,15,9],
    [13,0,7,10,6,4,15,11,8,5,8,4,14,5,10],
    [15,3,14,1,14,14,5,7,6,5,7,14,8,7,2],
    [6,13,8,0,13,8,13,13,1,9,3,4,6,7,9],
    [1,13,9,9,3,14,7,3,10,1,2,7,13,6,3],
    [9,9,5,8,14,0,13,7,1,4,3,0,15,3,6],
    [7,10,5,2,5,8,3,14,2,3,1,8,9,0,4],
    [3,13,6,11,7,0,14,11,2,2,14,8,5,15,9],
    [4,11,10,12,14,0,0,15,5,9,2,12,14,14,6],
    [3,3,15,12,8,3,15,8,15,1,10,13,3,14,13],
    [15,3,1,10,3,3,10,15,12,0,7,10,12,12,3]
  ]
}
```

### Get all types of Maps

`POST` /api/get-maptypes

#### Return format

- **maptypes** (array)
  - **name** — Name of the Map, shown to the User
  - **maptype** — layerName for `/api/generate-map`

#### Errors

- 500 `"Internal Server Error"` :(

#### Example

`POST` /api/get-maptypes

Response:
```json
{
  "maptypes": [{
    "name": "Random Map",
    "maptype": "random"
  }, {
    "name": "Elevation Map",
    "maptype": "elevation"
  }, {
    "name": "Wind Map",
    "maptype": "wind"
  }]
}
```
