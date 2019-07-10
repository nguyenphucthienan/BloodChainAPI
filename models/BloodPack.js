const mongoose = require('mongoose');
const { Schema } = mongoose;
const testDetailSchema = require('./schemas/testDetailSchema');
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
  bloodTestCenter: {
    type: Schema.Types.ObjectId,
    ref: 'BloodTestCenter'
  },
  tested: {
    type: Boolean,
    default: false
  },
  testPassed: {
    type: Boolean
  },
  testDetail: [
    { type: testDetailSchema }
  ],
  separated: {
    type: Boolean,
    default: false
  },
  bloodSeparationCenter: {
    type: Schema.Types.ObjectId,
    ref: 'BloodSeparationCenter'
  },
  currentLocation: {
    type: Schema.Types.ObjectId,
    require: 'Current location is required'
  },
  history: [
    { type: historySchema }
  ]
}, { timestamps: true });

mongoose.model('BloodPack', bloodPackSchema);
