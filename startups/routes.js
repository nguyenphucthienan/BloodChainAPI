const infoRoutes = require('../routes/infoRoutes');
const authRoutes = require('../routes/authRoutes');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api', infoRoutes);
};
