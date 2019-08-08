const userService = require('../services/userService');
const RoleNames = require('../constants/RoleNames');

const allowedRoles = [
  RoleNames.ADMIN,
  RoleNames.BLOOD_CAMP,
  RoleNames.BLOOD_TEST_CENTER,
  RoleNames.BLOOD_SEPARATION_CENTER,
  RoleNames.BLOOD_BANK,
  RoleNames.HOSPITAL
];

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const user = await userService.getUserById(id);
  if (!user) {
    return res.status(404).send();
  }

  // User
  if (userId.toString() === user._id.toString()) {
    return next();
  }

  // Allowed roles
  const roleNames = req.user.roles.map(role => role.name);
  const commonRoleNames = roleNames.filter(roleName => allowedRoles.includes(roleName));

  if (commonRoleNames.length > 0) {
    return next();
  }

  return res.status(403).send({ message: 'You do not have permission to do this' });
};
