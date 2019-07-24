const bloodPackService = require('../services/bloodPackService');
const RoleNames = require('../constants/RoleNames');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const bloodPack = await bloodPackService.getBloodPackById(id);
  if (!bloodPack) {
    return res.status(404).send();
  }

  const roleNames = req.user.roles.map(role => role.name);
  if (roleNames.length === 1 
    && roleNames[0] === RoleNames.DONOR 
    && userId.toString() !== bloodPack.donor._id.toString()) {
    return res.status(403).send();
  }

  return next();
};
