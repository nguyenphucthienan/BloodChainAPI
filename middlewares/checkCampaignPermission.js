const campaignService = require('../services/campaignService');
const RoleNames = require('../constants/RoleNames');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const campaign = await campaignService.getCampaignById(id);
  if (!campaign) {
    return res.status(404).send();
  }

  const roleNames = req.user.roles.map(role => role.name);

  // Admin
  const hasAdminRole = roleNames.some(roleName => roleName === RoleNames.ADMIN);
  if (hasAdminRole) {
    return next();
  }

  // Campaign's owner
  const hasBloodCampRole = roleNames.some(roleName => roleName === RoleNames.BLOOD_CAMP)
  if (hasBloodCampRole && req.user.bloodCamp._id.toString() === campaign.bloodCamp._id.toString()) {
    return next();
  }

  return res.status(403).send({ message: 'You do not have permission to do this' });
};
