const RoleNames = require('../constants/RoleNames');
const bloodPackService = require('../services/bloodPackService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const {
  validateCreateBloodPack,
  validateUpdateTestResults,
  validateUpdateSeparationResults
} = require('../validations/bloodPackValidations');

exports.getBloodPacks = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodPackFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodPacks = await bloodPackService.getBloodPacks(paginationObj, filterObj, sortObj);
  const totalItems = await bloodPackService.countBloodPacks(filterObj);

  const data = {
    items: bloodPacks,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getMyBloodPacks = async (req, res) => {
  req.query.donor = req.user.id;

  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodPackFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodPacks = await bloodPackService.getBloodPacks(paginationObj, filterObj, sortObj);
  const totalItems = await bloodPackService.countBloodPacks(filterObj);

  const data = {
    items: bloodPacks,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.getBloodPackById(id);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.createBloodPack = async (req, res) => {
  const { error } = validateCreateBloodPack(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodCampId = req.user.bloodCamp._id;
  const bloodPack = await bloodPackService.createBloodPack({
    ...req.body,
    bloodCamp: bloodCampId,
    currentLocation: bloodCampId
  });

  return res.send(bloodPack);
};

exports.updateBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.updateBloodPackById(id, req.body);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.deleteBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.deleteBloodPackById(id);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.getTransferHistories = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.getBloodPackById(id);

  if (!bloodPack) {
    return res.status(404).send();
  }

  const histories = await bloodPackService.getTransferHistories(id);
  return res.send(histories);
};

exports.updateTestResults = async (req, res) => {
  const { error } = validateUpdateTestResults(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const { bloodType, testResults, testDescription } = req.body;
  const bloodTestCenterId = req.user.bloodTestCenter._id;

  const bloodPack = await bloodPackService.getBloodPackById(id);
  if (!bloodPack) {
    return res.status(404).send();
  }

  if (!bloodPack.currentLocation.equals(bloodTestCenterId)) {
    return res.status(403).send('You do not have permission to update blood test result');
  }

  const updatedBloodPack = await bloodPackService
    .updateTestResultsById(id, bloodType, testResults, testDescription);

  if (!updatedBloodPack) {
    return res.status(404).send();
  }
  return res.send(updatedBloodPack);
};

exports.updateSeparationResults = async (req, res) => {
  const { error } = validateUpdateSeparationResults(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const { separationResults, separationDescription } = req.body;
  const bloodSeparationCenterId = req.user.bloodSeparationCenter._id;

  const bloodPack = await bloodPackService.getBloodPackById(id);
  if (!bloodPack) {
    return res.status(404).send();
  }

  if (!bloodPack.currentLocation.equals(bloodSeparationCenterId)) {
    return res.status(403).send('You do not have permission to update blood separation result');
  }

  const updatedBloodPack = await bloodPackService
    .updateSeparationResultsById(id, separationResults, separationDescription);

  if (!updatedBloodPack) {
    return res.status(404).send();
  }
  return res.send(updatedBloodPack);
};

exports.transferBloodPacksToBloodTestCenter = async (req, res) => {
  const bloodCampId = req.user.bloodCamp._id;
  const { username } = req.user;
  const { bloodPackIds, bloodTestCenterId, description } = req.body;

  const results = await bloodPackService.transferBloodPacksToBloodTestCenter(
    username,
    bloodCampId,
    bloodPackIds,
    bloodTestCenterId,
    description
  );

  return res.send(results);
};

exports.transferBloodPacksToBloodSeparationCenter = async (req, res) => {
  const bloodTestCenterId = req.user.bloodTestCenter._id;
  const { username } = req.user;
  const { bloodPackIds, bloodSeparationCenterId, description } = req.body;

  const results = await bloodPackService.transferBloodPacksToBloodSeparationCenter(
    username,
    bloodTestCenterId,
    bloodPackIds,
    bloodSeparationCenterId,
    description
  );

  return res.send(results);
};

exports.disposeBloodPacks = async (req, res) => {
  const { username } = req.user;
  const {
    organizationType,
    organizationId,
    bloodPackIds,
    description
  } = req.body;

  let organization;
  switch (organizationType) {
    case RoleNames.BLOOD_CAMP:
      organization = req.user.bloodCamp;
      break;
    case RoleNames.BLOOD_TEST_CENTER:
      organization = req.user.bloodTestCenter;
      break;
    case RoleNames.BLOOD_SEPARATION_CENTER:
      organization = req.user.bloodSeparationCenter;
      break;
  }

  if (!organization) {
    return res.status(400).send();
  }

  const results = await bloodPackService.disposeBloodPacks(
    username,
    organizationType,
    organizationId,
    bloodPackIds,
    description
  );

  return res.send(results);
};
