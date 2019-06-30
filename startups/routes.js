const infoRoutes = require('../routes/infoRoutes');
const authRoutes = require('../routes/authRoutes');
const errorHandlers = require('../handlers/errorHandlers');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api', infoRoutes);

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    app.use(errorHandlers.productionErrorHandler);
  } else {
    app.use(errorHandlers.developmentErrorHandler);
  }
};
