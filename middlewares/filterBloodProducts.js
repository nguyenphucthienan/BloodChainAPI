const RoleNames = require('../constants/RoleNames');

module.exports = (req, res, next) => {
  const { organization } = req.query;
  const roleNames = req.user.roles.map(role => role.name);

  if (!organization) {
    return next();
  } else if (!organization) {
    return res.status(400).send({ message: 'Organization type is required' });
  }

  if (!roleNames.includes(organization)) {
    return res.status(400).send({ message: 'Role and organization type do not match' });
  }

  switch (organization) {
    case RoleNames.BLOOD_SEPARATION_CENTER: {
      req.query.currentLocation = req.user.bloodSeparationCenter._id;
      break;
    }
    case RoleNames.BLOOD_BANK: {
      req.query.currentLocation = req.user.bloodBank._id;
      break;
    }
    case RoleNames.HOSPITAL: {
      req.query.currentLocation = req.user.hospital._id;
      break;
    }
    default: {
      return res.status(400).send({ message: 'Organization type is invalid' });
    }
  }

  return next();
};
