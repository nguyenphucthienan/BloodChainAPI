const mongoose = require('mongoose');
const { Schema } = mongoose;

const testDetailSchema = new Schema({
  testType: {
    type: mongoose.Types.ObjectId,
    ref: 'TestType',
    required: 'Test type is required',
    description: String
  },
  passed: {
    type: Boolean,
    required: 'Result is required'
  }
}, { timestamps: true });

module.exports = testDetailSchema;
