const mongoose = require('mongoose');
const { Schema } = mongoose;
const BloodTypes = require('../constants/BloodTypes');
const testResultSchema = require('./schemas/testResultSchema');
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
  bloodType: {
    type: String,
    enum: [
      BloodTypes.A_POSITIVE,
      BloodTypes.A_NEGATIVE,
      BloodTypes.B_POSITIVE,
      BloodTypes.B_NEGATIVE,
      BloodTypes.O_POSITIVE,
      BloodTypes.O_NEGATIVE,
      BloodTypes.AB_POSITIVE,
      BloodTypes.AB_NEGATIVE
    ]
  },
  tested: {
    type: Boolean,
    default: false
  },
  testPassed: {
    type: Boolean
  },
  disposed: {
    type: Boolean
  },
  testResults: [
    { type: testResultSchema }
  ],
  testDescription: {
    type: String,
    trim: true
  },
  separated: {
    type: Boolean,
    default: false
  },
  separationDescription: {
    type: String,
    trim: true
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
