const mongoose = require('mongoose');
const { Schema } = mongoose;

const campaignSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  bloodCamp: {
    type: Schema.Types.ObjectId,
    ref: 'BloodCamp',
    required: 'Blood camp is required',
  },
  startDate: {
    type: Date,
    required: 'Start date is required'
  },
  endDate: {
    type: Date,
    required: 'End date is required'
  },
  description: {
    type: String,
    required: 'Description is required',
    trim: true
  },
  photos: [{
    type: Schema.Types.ObjectId,
    ref: 'Photo'
  }]
}, { timestamps: true });

mongoose.model('Campaign', campaignSchema);
