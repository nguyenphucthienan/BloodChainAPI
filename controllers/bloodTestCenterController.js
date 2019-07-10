const userService = require('../services/userService');
const bloodTestCenterService = require('../services/bloodTestCenterService');
const RoleNames = require('../constants/RoleNames');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateBloodTestCenter } = require('../validations/bloodTestCenterValidations');

exports.getBloodTestCenters = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodTestCenterFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodTestCenters = await bloodTestCenterService.getBloodTestCenters(paginationObj, filterObj, sortObj);
  const totalItems = await bloodTestCenterService.countBloodTestCenters(filterObj);

  const data = {
    items: bloodTestCenters,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodTestCenter = async (req, res) => {
  const { id } = req.params;
  const bloodTestCenter = await bloodTestCenterService.getBloodTestCenterById(id);

  if (!bloodTestCenter) {
    return res.status(404).send();
  }

  return res.send(bloodTestCenter);
};

exports.createBloodTestCenter = async (req, res) => {
  const { error } = validateBloodTestCenter(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodTestCenter = await bloodTestCenterService.createBloodTestCenter(req.body);
  return res.send(bloodTestCenter);
};

exports.updateBloodTestCenter = async (req, res) => {
  const { error } = validateBloodTestCenter(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const bloodTestCenter = await bloodTestCenterService.updateBloodTestCenterById(id, req.body);

  if (!bloodTestCenter) {
    return res.status(404).send();
  }

  return res.send(bloodTestCenter);
};

exports.deleteBloodTestCenter = async (req, res) => {
  const { id } = req.params;
  const bloodTestCenter = await bloodTestCenterService.deleteBloodTestCenterById(id);

  if (!bloodTestCenter) {
    return res.status(404).send();
  }

  return res.send(bloodTestCenter);
};

exports.getStaffsOfBloodTestCenter = async (req, res) => {
  const { id } = req.params;
  const bloodTestCenter = await bloodTestCenterService.getBloodTestCenterById(id);

  if (!bloodTestCenter) {
    return res.status(404).send();
  }

  const users = await userService.getStaffsOfOrganization(RoleNames.BLOOD_TEST_CENTER, id);
  return res.send(users);
};
