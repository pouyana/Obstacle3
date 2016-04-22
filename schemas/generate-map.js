module.exports = {
  type: 'object',
  properties: {
    flightarea: {
      type: 'object',
      properties: {
        lat: {
          type: 'float',
          minimum: -90,
          maximun: 90,
          description: 'Latitude of the upper left corner of the Flightarea'
        },
        long: {
          type: 'float',
          minimum: -180,
          maximun: 180,
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
      required: ['lat', 'long', 'length', 'width']
    },
    drone: {
      type: 'object',
      properties: {
        mass: {
          type: 'integer',
          minimum: 0,
          description: 'Mass in kg'
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
      },
      required: ['mass', 'maxSpeed', 'maxFlightHeight']
    }
  },
  required: ['flightarea', 'drone']
}
