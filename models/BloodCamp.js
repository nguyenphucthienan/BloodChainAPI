const mongoose = require('mongoose');
const { Schema } = mongoose;
const pointSchema = require('./schemas/pointSchema');

const bloodCampSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  location: {
    type: pointSchema,
    required: 'Location is required'
  }
}, { timestamps: true });

mongoose.model('BloodCamp', bloodCampSchema);
