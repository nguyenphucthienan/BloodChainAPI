const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const userService = require('../userService');
const config = require('../../config');

const jwtOptions = {
  secretOrKey: config.secretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const passportJwt = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userService.getUserById(payload.id);
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passportJwt;
