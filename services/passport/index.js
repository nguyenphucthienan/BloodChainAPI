const passport = require('passport');
const passportLocal = require('./passportLocal');
const passportJwt = require('./passportJwt');

module.exports = () => {
  passport.use(passportLocal);
  passport.use(passportJwt);
};
