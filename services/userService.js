const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUsers = (paginationObj, filterObj, sortObj) => (
  User.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roles'
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        photoUrl: 1,
        'roles._id': 1,
        'roles.name': 1,
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

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

exports.updateUserById = (id, user) => (
  User
    .findByIdAndUpdate(id,
      { $set: user },
      { new: true })
    .exec()
);

exports.countUsers = filterObj => (
  User.find(filterObj)
    .countDocuments()
    .exec()
);
