const RoleNames = require('../constants/RoleNames');

module.exports = (req, res, next) => {
  const { donor, organization } = req.query;

  // Get donor's donation history
  if (donor) {
    return next();
  }
  
  if (!organization) {
    return next();
  }

  const roleNames = req.user.roles.map(role => role.name);

  if (!roleNames.includes(organization)) {
    return res.status(400).send({ message: 'Role and organization type do not match' });
  }

  switch (organization) {
    case RoleNames.BLOOD_CAMP: {
      req.query.currentLocation = req.user.bloodCamp._id;
      break;
    }
    case RoleNames.BLOOD_TEST_CENTER: {
      req.query.currentLocation = req.user.bloodTestCenter._id;
      break;
    }
    case RoleNames.BLOOD_SEPARATION_CENTER: {
      req.query.currentLocation = req.user.bloodSeparationCenter._id;
      break;
    }
    case RoleNames.BLOOD_BANK: {
      req.query.currentLocation = req.user.bloodBank._id;
      break;
    }
    case RoleNames.HOSPITAL: {
      req.query.currentLocation = req.user.bloodTestCenter._id;
      break;
    }
    default: {
      return res.status(400).send({ message: 'Organization type is invalid' });
    }
  }

  return next();
};
