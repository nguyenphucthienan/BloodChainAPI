const winston = require('winston');
const config = require('../config');
require('winston-mongodb');

module.exports = () => {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  // eslint-disable-next-line no-undef
  process.on('unhandledRejection', (exception) => {
    throw exception;
  });

  winston.add(winston.transports.MongoDB, {
    db: config.mongoUri,
    collection: 'logs',
    level: 'info'
  });
}
