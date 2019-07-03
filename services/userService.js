const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUsers = (paginationObj, filterObj, sortObj) => (
  User.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'bloodcamps',
        localField: 'bloodCamp',
        foreignField: '_id',
        as: 'bloodCamp'
      }
    },
    {
      $unwind: {
        path: '$bloodCamp',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roles'
      }
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
        'bloodCamp._id': 1,
        'bloodCamp.name': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getUserById = (id) => {
  return User.findById(id)
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
    .select(
      {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        photoUrl: 1,
        roles: 1,
        bloodCamp: 1
      }
    )
    .exec();
};

exports.getUserByUsername = username => (
  User.findOne({ username })
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
    .exec()
);

exports.getUserByEmail = email => (
  User.findOne({ email })
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
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

exports.assignRoleToUser = (id, roleId, organization) => {
  return User
    .findByIdAndUpdate(id,
      {
        $addToSet: { roles: roleId },
        $set: { ...organization }
      },
      { new: true })
    .exec();
};
