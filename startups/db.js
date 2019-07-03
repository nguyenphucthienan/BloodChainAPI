const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', true);
  mongoose.connect(config.mongoUri, { useNewUrlParser: true });
};
