const express = require('express');
const app = express();
const winston = require('winston');
const config = require('./config');

require('./startups/db')();
require('./startups/registerModels')();
require('./startups/seeds')();
require('./services/passport')();
require('./startups/logging')();

require('./startups/utils')(app);
require('./startups/cors')(app);
require('./startups/routes')(app);

app.listen(config.port, () => {
  winston.info(`Server listening on PORT ${config.port}`);
});
