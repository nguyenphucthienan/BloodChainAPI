const rewardService = require('../services/rewardService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateReward } = require('../validations/rewardValidations');

exports.getRewards = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const rewards = await rewardService.getRewards(paginationObj, filterObj, sortObj);
  const totalItems = await rewardService.countRewards(filterObj);

  const data = {
    items: rewards,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getPublicRewards = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const rewards = await rewardService.getPublicRewards(paginationObj, filterObj, sortObj);
  const totalItems = await rewardService.countRewards(filterObj);

  const data = {
    items: rewards,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getReward = async (req, res) => {
  const { id } = req.params;
  const reward = await rewardService.getRewardById(id);

  if (!reward) {
    return res.status(404).send();
  }

  return res.send(reward);
};

exports.createReward = async (req, res) => {
  const { error } = validateReward(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const reward = await rewardService.createReward(req.body);
  return res.send(reward);
};

exports.updateReward = async (req, res) => {
  const { error } = validateReward(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const reward = await rewardService.updateRewardById(id, req.body);

  if (!reward) {
    return res.status(404).send();
  }

  return res.send(reward);
};

exports.deleteReward = async (req, res) => {
  const { id } = req.params;
  const reward = await rewardService.deleteRewardById(id);

  if (!reward) {
    return res.status(404).send();
  }

  return res.send(reward);
};

exports.updateRewardCodes = async (req, res) => {
  const { id } = req.params;
  const { codesToAdd, codesToRemove } = req.body;

  const reward = await rewardService.updateRewardCodesById(id, codesToAdd, codesToRemove);
  if (!reward) {
    return res.status(404).send();
  }

  return res.send(reward);
};

exports.uploadRewardPhoto = async (req, res) => {
  const { id } = req.params;
  const reward = await rewardService.getRewardById(id);

  if (!reward) {
    return res.status(404).send();
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const updatedReward = await rewardService.uploadRewardPhotoById(id, file);
  if (!updatedReward) {
    return res.status(404).send();
  }

  return res.send(updatedReward);
};

exports.deleteRewardPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const reward = await rewardService.deleteRewardPhotoById(id, photoId);

  if (!reward) {
    return res.status(404).send();
  }

  return res.send(reward);
};

exports.redeemReward = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const code = await rewardService.redeemRewardById(id, userId);
  if (!code) {
    return res.status(404).send();
  }

  return res.send({ code });
};
