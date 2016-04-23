module.exports = {
  type: 'object',
  properties: {
    flightarea: {
      type: 'object',
      properties: {
        lat: {
          type: 'float',
          minimum: -90,
          maximum: 90,
          description: 'Latitude of the upper left corner of the Flightarea'
        },
        lon: {
          type: 'float',
          minimum: -180,
          maximum: 180,
          description: 'Longitude of the upper left corner of the Flightarea'
        },
        length: {
          type: 'integer',
          description: 'Length of the Flightarea'
        },
        width: {
          type: 'integer',
          description: 'Width of the Flightarea'
        }
      },
      required: ['lat', 'lon', 'length', 'width']
    },
    drone: {
      type: 'object',
      properties: {
        mass: {
          type: 'integer',
          minimum: 0,
          description: 'Mass in g'
        },
        maxSpeed: {
          type: 'integer',
          minimum: 0,
          description: 'Maximum Speed in m/s'
        },
        maxFlightHeight: {
          type: 'integer',
          minimum: 0,
          description: 'Maximum Flight Height over Ground in m'
        }
      }
    },
    accuracy: {
      type: 'integer',
      minimum: 1,
      description: 'How detailed the map should be in m'
    }
  },
  required: ['flightarea']
}
