const bloodPackService = require('../services/bloodPackService');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const { id: bloodCampId } = req.user.bloodCamp;

  const bloodPack = await bloodPackService.getBloodPackById(id);
  if (!bloodPack) {
    return res.status(404).send();
  }

  if (bloodCampId.toString() === bloodPack.currentLocation.toString()) {
    return next();
  }

  return res.status(403).send({ message: 'You do not have permission to do this' });
};
