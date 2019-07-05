const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const BloodCamp = mongoose.model('BloodCamp');
const generator = require('generate-password');
const RoleNames = require('../constants/RoleNames');
const OrganizationFieldNames = require('../constants/OrganizationFieldNames');

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
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        address: 1,
        location: 1,
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
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        adddress: 1,
        location: 1,
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
    .select(
      {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        adddress: 1,
        location: 1,
        photoUrl: 1,
        roles: 1,
        bloodCamp: 1
      }
    )
    .exec()
);

exports.getUserByEmail = email => (
  User.findOne({ email })
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
        adddress: 1,
        location: 1,
        photoUrl: 1,
        roles: 1,
        bloodCamp: 1
      }
    )
    .exec()
);

exports.registerUser = (user) => {
  const newUser = new User(user);
  return newUser.save();
};

exports.createUser = async (user) => {
  const rawPassword = generator.generate({
    length: 10,
    numbers: true
  });

  const newUser = new User({ ...user, password: rawPassword });
  const returnUser = await newUser.save();
  return { ...returnUser.toObject(), rawPassword };
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

exports.getStaffsOfOrganization = async (organizationRoleName, organizationId) => {
  const role = await Role.findOne({ name: organizationRoleName });
  const users = await User
    .find({
      roles: role._id,
      [OrganizationFieldNames[organizationRoleName]]: organizationId
    })
    .select({
      _id: 1,
      username: 1
    })
    .sort({
      username: 1
    });

  return users;
};

exports.assignOrganization = async (userIds, organizationRoleName, organizationId) => {
  const role = await Role.findOne({ name: organizationRoleName });
  if (!role) {
    return { success: 0, errors: userIds.length };
  }

  let success = 0, errors = 0;

  const organizationRoleFieldName = OrganizationFieldNames[organizationRoleName];
  if (!organizationRoleFieldName) {
    return { success: 0, errors: userIds.length };
  }

  switch (organizationRoleName) {
    case RoleNames.BLOOD_CAMP: {
      const bloodCamp = await BloodCamp.findById(organizationId);
      if (!bloodCamp) {
        return { success: 0, errors: userIds.length };
      }
      break;
    }

    default: {
      break;
    }
  }

  const existingUsers = await this.getStaffsOfOrganization(RoleNames.BLOOD_CAMP, organizationId);
  const existingIds = existingUsers.map(user => user._id.toString());

  const allIds = Array.from(new Set([...existingIds, ...userIds]));
  const commonIds = existingIds.filter(id => userIds.includes(id));
  const uncommonIds = allIds.filter(id => !commonIds.includes(id));

  for (let userId of uncommonIds) {
    let user;
    if (existingIds.includes(userId)) {
      user = await User.findOneAndUpdate(
        {
          _id: userId,
          [organizationRoleFieldName]: { $exists: true }
        },
        {
          $pull: { roles: role._id },
          $unset: { [organizationRoleFieldName]: 1 }
        },
        { new: true });
    } else {
      user = await User.findOneAndUpdate(
        {
          _id: userId,
          [organizationRoleFieldName]: { $exists: false }
        },
        {
          $addToSet: { roles: role._id },
          $set: { [organizationRoleFieldName]: organizationId }
        },
        { new: true });
    }

    if (!user) {
      errors += 1;
    } else {
      success += 1;
    }
  }

  return { success, errors };
}
