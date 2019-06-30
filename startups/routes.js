const infoRoutes = require('../routes/infoRoutes');

module.exports = (app) => {
  app.use('/api', infoRoutes);
}
