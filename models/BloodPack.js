const mongoose = require('mongoose');
const { Schema } = mongoose;
const historySchema = require('./schemas/historySchema');

const bloodPackSchema = new Schema({
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'Donor is required',
  },
  volume: {
    type: Number,
    required: 'Volume is required'
  },
  bloodCamp: {
    type: Schema.Types.ObjectId,
    ref: 'BloodCamp',
    required: 'Blood camp is required',
  },
  tested: {
    type: Boolean,
    default: false
  },
  bloodTestCenter: {
    type: Schema.Types.ObjectId,
    ref: 'BloodTestCenter'
  },
  separated: {
    type: Boolean,
    default: false
  },
  bloodSeparationCenter: {
    type: Schema.Types.ObjectId,
    ref: 'BloodSeparationCenter'
  },
  histories: [
    { type: historySchema }
  ]
}, { timestamps: true });

mongoose.model('BloodPack', bloodPackSchema);
