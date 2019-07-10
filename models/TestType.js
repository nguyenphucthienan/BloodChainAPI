const mongoose = require('mongoose');
const { Schema } = mongoose;

const testTypeSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  description: {
    type: String,
    required: 'Description is required',
    trim: true
  }
}, { timestamps: true });

mongoose.model('TestType', testTypeSchema);
