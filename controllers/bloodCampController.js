const bloodCampService = require('../services/bloodCampService');
const { validateBloodCamp } = require('../validations/bloodCampValidations');

exports.getBloodCamps = async (req, res) => {
  const bloodCamps = await bloodCampService.getBloodCamps();
  return res.send(bloodCamps);
};

exports.getBloodCamp = async (req, res) => {
  const { id } = req.params;
  const bloodCamp = await bloodCampService.getBloodCampById(id);

  if (!bloodCamp) {
    return res.status(404).send();
  }

  return res.send(bloodCamp);
};

exports.createBloodCamp = async (req, res) => {
  const { error } = validateBloodCamp(req.body);
  if (error) {
    return res.status(400).send(error.toString());
  }

  const bloodCamp = await bloodCampService.createBloodCamp(req.body);
  return res.send(bloodCamp);
};

exports.deleteBloodCamp = async (req, res) => {
  const { id } = req.params;
  const bloodCamp = await bloodCampService.deleteBloodCampById(id);

  if (!bloodCamp) {
    return res.status(404).send();
  }

  return res.send(bloodCamp);
};
