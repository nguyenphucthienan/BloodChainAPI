const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
  from: {
    _id: {
      type: Schema.Types.ObjectId,
      required: 'ID (from) is required'
    },
    name: {
      type: String,
      required: 'Name (from) is required'
    }
  },
  to: {
    _id: {
      type: Schema.Types.ObjectId,
      required: 'ID (to) is required'
    },
    name: {
      type: String,
      required: 'Name (to) is required'
    }
  },
  description: String
}, { timestamps: true });

module.exports = historySchema;
