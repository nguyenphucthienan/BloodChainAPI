const infoRoutes = require('../routes/infoRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const roleRoutes = require('../routes/roleRoutes');
const bloodCampRoutes = require('../routes/bloodCampRoutes');
const errorHandlers = require('../handlers/errorHandlers');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/roles', roleRoutes);
  app.use('/api/blood-camps', bloodCampRoutes);
  app.use('/api', infoRoutes);

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    app.use(errorHandlers.productionErrorHandler);
  } else {
    app.use(errorHandlers.developmentErrorHandler);
  }
};
