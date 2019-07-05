const infoRoutes = require('../routes/infoRoutes');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const roleRoutes = require('../routes/roleRoutes');
const bloodCampRoutes = require('../routes/bloodCampRoutes');
const bloodTestCenterRoutes = require('../routes/bloodTestCenterRoutes');
const bloodSeparationCenterRoutes = require('../routes/bloodSeparationCenterRoutes');
const bloodBankRoutes = require('../routes/bloodBankRoutes');
const errorHandlers = require('../handlers/errorHandlers');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/roles', roleRoutes);
  app.use('/api/blood-camps', bloodCampRoutes);
  app.use('/api/blood-test-centers', bloodTestCenterRoutes);
  app.use('/api/blood-separation-centers', bloodSeparationCenterRoutes);
  app.use('/api/blood-banks', bloodBankRoutes);
  app.use('/api', infoRoutes);

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    app.use(errorHandlers.productionErrorHandler);
  } else {
    app.use(errorHandlers.developmentErrorHandler);
  }
};
