const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const BloodCamp = mongoose.model('BloodCamp');
const BloodTestCenter = mongoose.model('BloodTestCenter');
const BloodSeparationCenter = mongoose.model('BloodSeparationCenter');
const BloodBank = mongoose.model('BloodBank');
const Hospital = mongoose.model('Hospital');
const generator = require('generate-password');
const RoleNames = require('../constants/RoleNames');
const BcryptUtils = require('../utils/BcryptUtils');
const OrganizationFieldNames = require('../constants/OrganizationFieldNames');
const web3BloodChainService = require('./web3/web3BloodChainService');
const web3UserInfoService = require('./web3/web3UserInfoService');
const BloodChainUtils = require('../utils/BloodChainUtils');

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
        from: 'bloodtestcenters',
        localField: 'bloodTestCenter',
        foreignField: '_id',
        as: 'bloodTestCenter'
      }
    },
    {
      $unwind: {
        path: '$bloodTestCenter',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'bloodseparationcenters',
        localField: 'bloodSeparationCenter',
        foreignField: '_id',
        as: 'bloodSeparationCenter'
      }
    },
    {
      $unwind: {
        path: '$bloodSeparationCenter',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'bloodbanks',
        localField: 'bloodBank',
        foreignField: '_id',
        as: 'bloodBank'
      }
    },
    {
      $unwind: {
        path: '$bloodBank',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'hospitals',
        localField: 'hospital',
        foreignField: '_id',
        as: 'hospital'
      }
    },
    {
      $unwind: {
        path: '$hospital',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'photos',
        localField: 'photo',
        foreignField: '_id',
        as: 'photo'
      }
    },
    {
      $unwind: {
        path: '$photo',
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
        gender: 1,
        birthdate: 1,
        email: 1,
        phone: 1,
        address: 1,
        location: 1,
        'photo._id': 1,
        'photo.url': 1,
        'photo.secureUrl': 1,
        'roles._id': 1,
        'roles.name': 1,
        'bloodCamp._id': 1,
        'bloodCamp.name': 1,
        'bloodTestCenter._id': 1,
        'bloodTestCenter.name': 1,
        'bloodSeparationCenter._id': 1,
        'bloodSeparationCenter.name': 1,
        'bloodBank._id': 1,
        'bloodBank.name': 1,
        'hospital._id': 1,
        'hospital.name': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getUserById = (id) => {
  return User.findById(id)
    .populate('photo', '_id url secureUrl')
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
    .populate('bloodTestCenter', '_id name')
    .populate('bloodSeparationCenter', '_id name')
    .populate('bloodBank', '_id name')
    .populate('hospital', '_id name')
    .select(
      {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        birthdate: 1,
        email: 1,
        phone: 1,
        address: 1,
        location: 1,
        photo: 1,
        roles: 1,
        bloodCamp: 1,
        bloodTestCenter: 1,
        bloodSeparationCenter: 1,
        bloodBank: 1,
        hospital: 1
      }
    )
    .exec();
};

exports.getUserByUsername = username => (
  User.findOne({ username })
    .populate('photo', '_id url secureUrl')
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
    .populate('bloodTestCenter', '_id name')
    .populate('bloodSeparationCenter', '_id name')
    .populate('bloodBank', '_id name')
    .populate('hospital', '_id name')
    .select(
      {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        birthdate: 1,
        email: 1,
        phone: 1,
        address: 1,
        location: 1,
        photoUrl: 1,
        roles: 1,
        bloodCamp: 1,
        bloodTestCenter: 1,
        bloodSeparationCenter: 1,
        bloodBank: 1,
        hospital: 1
      }
    )
    .exec()
);

exports.getUserByEmail = email => (
  User.findOne({ email })
    .populate('photo', '_id url secureUrl')
    .populate('roles', '_id name')
    .populate('bloodCamp', '_id name')
    .populate('bloodTestCenter', '_id name')
    .populate('bloodSeparationCenter', '_id name')
    .populate('bloodBank', '_id name')
    .populate('hospital', '_id name')
    .select(
      {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        birthdate: 1,
        address: 1,
        location: 1,
        photoUrl: 1,
        roles: 1,
        bloodCamp: 1,
        bloodTestCenter: 1,
        bloodSeparationCenter: 1,
        bloodBank: 1,
        hospital: 1
      }
    )
    .exec()
);

exports.registerUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();

  try {
    await web3BloodChainService.createUserInfo(newUser._id.toString());
    return newUser;
  } catch (error) {
    await this.deleteUserById(newUser._id);
    return null;
  }
};

exports.createUser = async (user) => {
  const rawPassword = generator.generate({
    length: 10,
    numbers: true
  });

  const newUser = new User({ ...user, password: rawPassword });
  await newUser.save();

  try {
    await web3BloodChainService.createUserInfo(newUser._id.toString());
    return { ...newUser.toObject(), rawPassword };
  } catch (error) {
    await this.deleteUserById(newUser._id);
    return null;
  }
};

exports.updateUserById = async (id, user) => {
  const password = user.password;
  if (password) {
    const hashedPassword = await BcryptUtils.hashPassword(password);
    if (hashedPassword) {
      // eslint-disable-next-line require-atomic-updates
      user.password = hashedPassword;
    } else {
      throw Error('Hash password failed');
    }
  }

  const updatedUser = await User
    .findByIdAndUpdate(id,
      { $set: user },
      { new: true })
    .exec();

  return updatedUser;
};

exports.deleteUserById = id => (
  User
    .findByIdAndDelete(id)
    .exec()
);

exports.countUsers = filterObj => (
  User.find(filterObj)
    .countDocuments()
    .exec()
);

exports.getUserInfoOnBlockChainById = async (id) => {
  const userInfoData = await web3BloodChainService.getUserInfo(id);
  const userInfo = BloodChainUtils.extractUserInfo(userInfoData);
  return userInfo;
}

exports.getPointHistoriesOnBlockChainById = async (id) => {
  const address = await web3BloodChainService.getUserInfoAddress(id);
  const historiesLength = await web3UserInfoService.getHistoriesLength(address);

  const historyPromises = [];
  for (let i = 0; i < historiesLength; i++) {
    historyPromises.push(web3UserInfoService.getHistory(address, i));
  }

  const histories = [];
  const historyData = await Promise.all(historyPromises);
  histories.push(...historyData.map(historyData => BloodChainUtils.extractPointHistoryInfo(historyData)));

  return histories;
}

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
    return { success: [], errors: userIds };
  }

  const organizationRoleFieldName = OrganizationFieldNames[organizationRoleName];
  if (!organizationRoleFieldName) {
    return { success: [], errors: userIds };
  }

  let organization;
  switch (organizationRoleName) {
    case RoleNames.BLOOD_CAMP: {
      organization = await BloodCamp.findById(organizationId);
      break;
    }
    case RoleNames.BLOOD_TEST_CENTER: {
      organization = await BloodTestCenter.findById(organizationId);
      break;
    }
    case RoleNames.BLOOD_SEPARATION_CENTER: {
      organization = await BloodSeparationCenter.findById(organizationId);
      break;
    }
    case RoleNames.BLOOD_BANK: {
      organization = await BloodBank.findById(organizationId);
      break;
    }
    case RoleNames.HOSPITAL: {
      organization = await Hospital.findById(organizationId);
      break;
    }
    default: {
      break;
    }
  }

  if (!organization) {
    return { success: [], errors: userIds };
  }

  const existingUsers = await this.getStaffsOfOrganization(organizationRoleName, organizationId);
  const existingIds = existingUsers.map(user => user._id.toString());

  const allIds = Array.from(new Set([...existingIds, ...userIds]));
  const commonIds = existingIds.filter(id => userIds.includes(id));
  const uncommonIds = allIds.filter(id => !commonIds.includes(id));

  let success = [], errors = [];

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
      errors.push(userId);
    } else {
      success.push(userId);
    }
  }

  return { success, errors };
}
