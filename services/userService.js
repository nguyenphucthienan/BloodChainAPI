const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUserById = (id) => {
  const _id = mongoose.Types.ObjectId(id);
  return User.findById({ _id })
    .populate('roles')
    .exec();
};

exports.getUserByUsername = username => (
  User.findOne({ username })
    .populate('roles')
    .exec()
);

exports.getUserByEmail = email => (
  User.findOne({ email })
    .populate('roles')
    .exec()
);

exports.createUser = (user) => {
  const newUser = new User(user);
  return newUser.save();
};
