const userService = require('../services/userService');
const hospitalService = require('../services/hospitalService');
const RoleNames = require('../constants/RoleNames');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateHospital } = require('../validations/hospitalValidations');

exports.getHospitals = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const hospitals = await hospitalService.getHospitals(paginationObj, filterObj, sortObj);
  const totalItems = await hospitalService.countHospitals(filterObj);

  const data = {
    items: hospitals,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getHospital = async (req, res) => {
  const { id } = req.params;
  const hospital = await hospitalService.getHospitalById(id);

  if (!hospital) {
    return res.status(404).send();
  }

  return res.send(hospital);
};

exports.createHospital = async (req, res) => {
  const { error } = validateHospital(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const hospital = await hospitalService.createHospital(req.body);
  return res.send(hospital);
};

exports.updateHospital = async (req, res) => {
  const { error } = validateHospital(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const hospital = await hospitalService.updateHospitalById(id, req.body);

  if (!hospital) {
    return res.status(404).send();
  }

  return res.send(hospital);
};

exports.deleteHospital = async (req, res) => {
  const { id } = req.params;
  const hospital = await hospitalService.deleteHospitalById(id);

  if (!hospital) {
    return res.status(404).send();
  }

  return res.send(hospital);
};

exports.getStaffsOfHospital = async (req, res) => {
  const { id } = req.params;
  const hospital = await hospitalService.getHospitalById(id);

  if (!hospital) {
    return res.status(404).send();
  }

  const users = await userService.getStaffsOfOrganization(RoleNames.HOSPITAL, id);
  return res.send(users);
};

exports.uploadHospitalPhoto = async (req, res) => {
  const { id } = req.params;
  const hospital = await hospitalService.getHospitalById(id);

  if (!hospital) {
    return res.status(404).send();
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const updatedHospital = await hospitalService.uploadHospitalPhotoById(id, file);
  if (!updatedHospital) {
    return res.status(404).send();
  }

  return res.send(updatedHospital);
};

exports.deleteHospitalPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const hospital = await hospitalService.deleteHospitalPhotoById(id, photoId);

  if (!hospital) {
    return res.status(404).send();
  }

  return res.send(hospital);
};
