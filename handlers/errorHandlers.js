/* eslint-disable no-unused-vars */

exports.developmentErrorHandler = (err, req, res, next) => {
  console.log('ERROR: ', err);
  return res.status(err.status || 500).send(err.message);
};

exports.productionErrorHandler = (err, req, res, next) => (
  res.status(500).send('Internal server error')
);
