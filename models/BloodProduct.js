const mongoose = require('mongoose');
const { Schema } = mongoose;
const BloodTypes = require('../constants/BloodTypes');
const historySchema = require('./schemas/historySchema');

const bloodProductSchema = new Schema({
  donor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'Donor is required',
  },
  bloodPack: {
    type: Schema.Types.ObjectId,
    ref: 'BloodPack',
    required: 'Blood pack is required',
  },
  bloodSeparationCenter: {
    type: Schema.Types.ObjectId,
    ref: 'BloodSeparationCenter',
    required: 'Blood separation center is required',
  },
  volume: {
    type: Number,
    required: 'Volume is required'
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
  expirationDate: {
    type: Date,
    require: 'Expiration date is required'
  },
  description: {
    type: String,
    trim: true
  },
  currentLocation: {
    type: Schema.Types.ObjectId,
    require: 'Current location is required'
  },
  history: [
    { type: historySchema }
  ]
}, { timestamps: true });

mongoose.model('BloodProduct', bloodProductSchema);
