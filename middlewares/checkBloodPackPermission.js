const bloodPackService = require('../services/bloodPackService');
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

  const bloodPack = await bloodPackService.getBloodPackById(id);
  if (!bloodPack) {
    return res.status(404).send();
  }

  // Blood pack's owner
  if (userId.toString() === bloodPack.donor._id.toString()) {
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
