const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(morgan('dev'));
};
