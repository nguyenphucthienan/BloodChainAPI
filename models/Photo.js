const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
  url: {
    type: String,
    required: 'URL is required',
    trim: true
  },
  secureUrl: {
    type: String,
    required: 'Secure URL is required',
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

mongoose.model('Photo', photoSchema);
