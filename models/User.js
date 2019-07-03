const mongoose = require('mongoose');
const { Schema } = mongoose;
const Role = mongoose.model('Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const BcryptUtils = require('../utils/BcryptUtils');
const RoleNames = require('../constants/RoleNames');
const config = require('../config');

const userSchema = new Schema({
  username: {
    type: String,
    required: 'Username is required',
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  email: {
    type: String,
    required: 'Email is required',
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: 'First name is required',
    trim: true
  },
  lastName: {
    type: String,
    required: 'Last name is required',
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }],
  bloodCamp: {
    type: Schema.Types.ObjectId,
    ref: 'BloodCamp'
  }
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  const user = this;

  const memberRole = await Role.findOne({ name: RoleNames.DONOR });
  user.roles.push(memberRole);

  try {
    user.password = await BcryptUtils.hashPassword(user.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function comparePassword(inputPassword, callback) {
  bcrypt.compare(inputPassword, this.password, (err, result) => {
    if (err) {
      return callback(err);
    }

    return callback(null, result);
  });
};

userSchema.methods.generateToken = function () {
  const user = this;
  const roles = user.roles.map(role => role.name);
  return jwt.sign(
    { id: user.id, roles },
    config.secretKey,
    { expiresIn: config.token.expirationTime }
  );
}

mongoose.model('User', userSchema);
