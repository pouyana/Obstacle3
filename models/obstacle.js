var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var obstacleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: {
    type: String,
    required: true
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String
  },
  height: String,
  classification: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('ground', obstacleSchema);
