const mongoose = require('mongoose');
const { Schema } = mongoose;

const rewardSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  codes: [{
    type: String,
    trim: true
  }],
  point: {
    type: Number,
    required: 'Number is required',
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

mongoose.model('Reward', rewardSchema);
