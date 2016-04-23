var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var obstacleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  coordinates: {
    type: {
      type: 'String',
      default: 'Point',
      required: true
    },
    coordinates: [{
      type: Number
    }]
  },
  landingRadius: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('positions', obstacleSchema);
