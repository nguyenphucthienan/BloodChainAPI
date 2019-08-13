const awardService = require('../services/awardService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateAward } = require('../validations/awardValidations');

exports.getAwards = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const awards = await awardService.getAwards(paginationObj, filterObj, sortObj);
  const totalItems = await awardService.countAwards(filterObj);

  const data = {
    items: awards,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getPublicAwards = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const awards = await awardService.getPublicAwards(paginationObj, filterObj, sortObj);
  const totalItems = await awardService.countAwards(filterObj);

  const data = {
    items: awards,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getAward = async (req, res) => {
  const { id } = req.params;
  const award = await awardService.getAwardById(id);

  if (!award) {
    return res.status(404).send();
  }

  return res.send(award);
};

exports.createAward = async (req, res) => {
  const { error } = validateAward(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const award = await awardService.createAward(req.body);
  return res.send(award);
};

exports.updateAward = async (req, res) => {
  const { error } = validateAward(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const award = await awardService.updateAwardById(id, req.body);

  if (!award) {
    return res.status(404).send();
  }

  return res.send(award);
};

exports.deleteAward = async (req, res) => {
  const { id } = req.params;
  const award = await awardService.deleteAwardById(id);

  if (!award) {
    return res.status(404).send();
  }

  return res.send(award);
};

exports.uploadAwardPhoto = async (req, res) => {
  const { id } = req.params;
  const award = await awardService.getAwardById(id);

  if (!award) {
    return res.status(404).send();
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const updatedAward = await awardService.uploadAwardPhotoById(id, file);
  if (!updatedAward) {
    return res.status(404).send();
  }

  return res.send(updatedAward);
};

exports.deleteAwardPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const award = await awardService.deleteAwardPhotoById(id, photoId);

  if (!award) {
    return res.status(404).send();
  }

  return res.send(award);
};
