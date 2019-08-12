const userService = require('../services/userService');
const bloodBankService = require('../services/bloodBankService');
const RoleNames = require('../constants/RoleNames');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateBloodBank } = require('../validations/bloodBankValidations');

exports.getBloodBanks = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodBankFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodBanks = await bloodBankService.getBloodBanks(paginationObj, filterObj, sortObj);
  const totalItems = await bloodBankService.countBloodBanks(filterObj);

  const data = {
    items: bloodBanks,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodBank = async (req, res) => {
  const { id } = req.params;
  const bloodBank = await bloodBankService.getBloodBankById(id);

  if (!bloodBank) {
    return res.status(404).send();
  }

  return res.send(bloodBank);
};

exports.createBloodBank = async (req, res) => {
  const { error } = validateBloodBank(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodBank = await bloodBankService.createBloodBank(req.body);
  return res.send(bloodBank);
};

exports.updateBloodBank = async (req, res) => {
  const { error } = validateBloodBank(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const bloodBank = await bloodBankService.updateBloodBankById(id, req.body);

  if (!bloodBank) {
    return res.status(404).send();
  }

  return res.send(bloodBank);
};

exports.deleteBloodBank = async (req, res) => {
  const { id } = req.params;
  const bloodBank = await bloodBankService.deleteBloodBankById(id);

  if (!bloodBank) {
    return res.status(404).send();
  }

  return res.send(bloodBank);
};

exports.getStaffsOfBloodBank = async (req, res) => {
  const { id } = req.params;
  const bloodBank = await bloodBankService.getBloodBankById(id);

  if (!bloodBank) {
    return res.status(404).send();
  }

  const users = await userService.getStaffsOfOrganization(RoleNames.BLOOD_BANK, id);
  return res.send(users);
};

exports.uploadBloodBankPhoto = async (req, res) => {
  const { id } = req.params;
  const bloodBank = await bloodBankService.getBloodBankById(id);

  if (!bloodBank) {
    return res.status(404).send();
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const updatedBloodBank = await bloodBankService.uploadBloodBankPhotoById(id, file);
  if (!updatedBloodBank) {
    return res.status(404).send();
  }

  return res.send(updatedBloodBank);
};

exports.deleteBloodBankPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const bloodBank = await bloodBankService.deleteBloodBankPhotoById(id, photoId);

  if (!bloodBank) {
    return res.status(404).send();
  }

  return res.send(bloodBank);
};
