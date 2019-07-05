const userService = require('../services/userService');
const bloodSeparationCenterService = require('../services/bloodSeparationCenterService');
const RoleNames = require('../constants/RoleNames');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateBloodSeparationCenter } = require('../validations/bloodSeparationCenterValidations');

exports.getBloodSeparationCenters = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodSeparationCenters = await bloodSeparationCenterService.getBloodSeparationCenters(paginationObj, filterObj, sortObj);
  const totalItems = await bloodSeparationCenterService.countBloodSeparationCenters(filterObj);

  const data = {
    items: bloodSeparationCenters,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodSeparationCenter = async (req, res) => {
  const { id } = req.params;
  const bloodSeparationCenter = await bloodSeparationCenterService.getBloodSeparationCenterById(id);

  if (!bloodSeparationCenter) {
    return res.status(404).send();
  }

  return res.send(bloodSeparationCenter);
};

exports.createBloodSeparationCenter = async (req, res) => {
  const { error } = validateBloodSeparationCenter(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodSeparationCenter = await bloodSeparationCenterService.createBloodSeparationCenter(req.body);
  return res.send(bloodSeparationCenter);
};

exports.updateBloodSeparationCenter = async (req, res) => {
  const { error } = validateBloodSeparationCenter(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const bloodSeparationCenter = await bloodSeparationCenterService.updateBloodSeparationCenterById(id, req.body);

  if (!bloodSeparationCenter) {
    return res.status(404).send();
  }

  return res.send(bloodSeparationCenter);
};

exports.deleteBloodSeparationCenter = async (req, res) => {
  const { id } = req.params;
  const bloodSeparationCenter = await bloodSeparationCenterService.deleteBloodSeparationCenterById(id);

  if (!bloodSeparationCenter) {
    return res.status(404).send();
  }

  return res.send(bloodSeparationCenter);
};

exports.getStaffsOfBloodSeparationCenter = async (req, res) => {
  const { id } = req.params;
  const bloodSeparationCenter = await bloodSeparationCenterService.getBloodSeparationCenterById(id);

  if (!bloodSeparationCenter) {
    return res.status(404).send();
  }

  const users = await userService.getStaffsOfOrganization(RoleNames.BLOOD_SEPARATION_CENTER, id);
  return res.send(users);
};
