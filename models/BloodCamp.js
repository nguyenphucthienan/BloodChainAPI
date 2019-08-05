const mongoose = require('mongoose');
const { Schema } = mongoose;
const pointSchema = require('./schemas/pointSchema');

const bloodCampSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  email: {
    type: String,
    required: 'Email is required',
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: 'Phone is required',
    trim: true
  },
  address: {
    type: String,
    required: 'Address is required',
    trim: true
  },
  location: {
    type: pointSchema,
    required: 'Location is required'
  },
  photos: [{
    type: Schema.Types.ObjectId,
    ref: 'Photo'
  }]
}, { timestamps: true });

mongoose.model('BloodCamp', bloodCampSchema);
