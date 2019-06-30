const cors = require('cors');
const config = require('../config');

const whitelist = config.corsWhitelist;
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = (app) => {
  app.use(cors(corsOptions));
};
