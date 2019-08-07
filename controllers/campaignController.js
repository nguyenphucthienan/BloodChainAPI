const campaignService = require('../services/campaignService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateCampaign } = require('../validations/campaignValidations');

exports.getCampaigns = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createCampaignFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const campaigns = await campaignService.getCampaigns(paginationObj, filterObj, sortObj);
  const totalItems = await campaignService.countCampaigns(filterObj);

  const data = {
    items: campaigns,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getCampaign = async (req, res) => {
  const { id } = req.params;
  const campaign = await campaignService.getCampaignById(id);

  if (!campaign) {
    return res.status(404).send();
  }

  return res.send(campaign);
};

exports.createCampaign = async (req, res) => {
  const { error } = validateCampaign(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodCampId = req.user.bloodCamp._id;
  const campaign = await campaignService.createCampaign({
    ...req.body,
    bloodCamp: bloodCampId
  });

  return res.send(campaign);
};

exports.updateCampaign = async (req, res) => {
  const { error } = validateCampaign(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const campaign = await campaignService.updateCampaignById(id, req.body);

  if (!campaign) {
    return res.status(404).send();
  }

  return res.send(campaign);
};

exports.deleteCampaign = async (req, res) => {
  const { id } = req.params;
  const campaign = await campaignService.deleteCampaignById(id);

  if (!campaign) {
    return res.status(404).send();
  }

  return res.send(campaign);
};

exports.uploadCampaignPhoto = async (req, res) => {
  const { id } = req.params;
  const campaign = await campaignService.getCampaignById(id);

  if (!campaign) {
    return res.status(404).send();
  }

  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const updatedCampaign = await campaignService.uploadCampaignPhotoById(id, file);
  if (!updatedCampaign) {
    return res.status(404).send();
  }

  return res.send(updatedCampaign);
};

exports.deleteCampaignPhoto = async (req, res) => {
  const { id, photoId } = req.params;
  const campaign = await campaignService.deleteCampaignPhotoById(id, photoId);

  if (!campaign) {
    return res.status(404).send();
  }

  return res.send(campaign);
};
