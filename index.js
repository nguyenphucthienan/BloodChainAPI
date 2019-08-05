const express = require('express');
const app = express();
const winston = require('winston');
const config = require('./config');

require('./startups/db')();
require('./startups/registerModels')();
require('./startups/seeds')();
require('./startups/validation')();
require('./startups/cloudinary')();
require('./startups/initWeb3')();
require('./startups/logging')();
require('./services/passport')();

require('./startups/utils')(app);
require('./startups/cors')(app);
require('./startups/fileUpload')(app);
require('./startups/routes')(app);

app.listen(config.port, () => {
  winston.info(`Server listening on PORT ${config.port}`);
});
