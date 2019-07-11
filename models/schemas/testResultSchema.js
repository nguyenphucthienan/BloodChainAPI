const mongoose = require('mongoose');
const { Schema } = mongoose;

const testResultSchema = new Schema({
  testType: {
    type: mongoose.Types.ObjectId,
    ref: 'TestType',
    required: 'Test type is required'
  },
  passed: {
    type: Boolean,
    required: 'Result is required'
  }
}, { timestamps: true });

module.exports = testResultSchema;
