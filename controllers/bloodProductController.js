const bloodProductService = require('../services/bloodProductService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const RoleNames = require('../constants/RoleNames');

exports.getBloodProducts = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodProductFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodProducts = await bloodProductService.getBloodProducts(paginationObj, filterObj, sortObj);
  const totalItems = await bloodProductService.countBloodProducts(filterObj);

  const data = {
    items: bloodProducts,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodProduct = async (req, res) => {
  const { id } = req.params;
  const bloodProduct = await bloodProductService.getBloodProductById(id);

  if (!bloodProduct) {
    return res.status(404).send();
  }

  return res.send(bloodProduct);
};

exports.updateBloodProduct = async (req, res) => {
  const { id } = req.params;
  const bloodProduct = await bloodProductService.updateBloodProductById(id, req.body);

  if (!bloodProduct) {
    return res.status(404).send();
  }

  return res.send(bloodProduct);
};

exports.deleteBloodProduct = async (req, res) => {
  const { id } = req.params;
  const bloodProduct = await bloodProductService.deleteBloodProductById(id);

  if (!bloodProduct) {
    return res.status(404).send();
  }

  return res.send(bloodProduct);
};

exports.transferBloodProducts = async (req, res) => {
  const { username } = req.user;
  const {
    fromOrganizationType,
    toOrganizationType,
    toOrganizationId,
    bloodProductIds,
    description
  } = req.body;

  let fromOrganization;
  switch (fromOrganizationType) {
    case RoleNames.BLOOD_SEPARATION_CENTER:
      fromOrganization = req.user.bloodSeparationCenter;
      break;
    case RoleNames.BLOOD_BANK:
      fromOrganization = req.user.bloodBank;
      break;
    case RoleNames.HOSPITAL:
      fromOrganization = req.user.hospital;
      break;
  }

  if (!fromOrganization) {
    return res.status(400).send();
  }

  const results = await bloodProductService.transferBloodProducts(
    username,
    fromOrganizationType,
    fromOrganization._id,
    toOrganizationType,
    toOrganizationId,
    bloodProductIds,
    description
  );

  return res.send(results);
};

exports.useBloodProducts = async (req, res) => {
  const { username } = req.user;
  const {
    patientInfo,
    bloodProductIds,
    description
  } = req.body;

  const hospital = req.user.hospital;
  if (!hospital) {
    return res.status(400).send();
  }

  const results = await bloodProductService.useBloodProducts(
    username,
    hospital._id,
    patientInfo,
    bloodProductIds,
    description
  );

  return res.send(results);
};

exports.disposeBloodProducts = async (req, res) => {
  const { username } = req.user;
  const {
    organizationType,
    organizationId,
    bloodProductIds,
    description
  } = req.body;

  let organization;
  switch (organizationType) {
    case RoleNames.BLOOD_SEPARATION_CENTER:
      organization = req.user.bloodSeparationCenter;
      break;
    case RoleNames.BLOOD_BANK:
      organization = req.user.bloodBank;
      break;
    case RoleNames.HOSPITAL:
      organization = req.user.hospital;
      break;
  }

  if (!organization) {
    return res.status(400).send();
  }

  const results = await bloodProductService.disposeBloodProducts(
    username,
    organizationType,
    organizationId,
    bloodProductIds,
    description
  );

  return res.send(results);
};
