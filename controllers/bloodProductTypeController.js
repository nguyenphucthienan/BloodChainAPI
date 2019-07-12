const bloodProductTypeService = require('../services/bloodProductTypeService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateBloodProductType } = require('../validations/bloodProductTypeValidations');

exports.getAllBloodProductTypes = async (req, res) => {
  const bloodProductTypes = await bloodProductTypeService.getAllBloodProductTypes();
  return res.send(bloodProductTypes);
}

exports.getBloodProductTypes = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodProductTypes = await bloodProductTypeService.getBloodProductTypes(paginationObj, filterObj, sortObj);
  const totalItems = await bloodProductTypeService.countBloodProductTypes(filterObj);

  const data = {
    items: bloodProductTypes,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodProductType = async (req, res) => {
  const { id } = req.params;
  const bloodProductType = await bloodProductTypeService.getBloodProductTypeById(id);

  if (!bloodProductType) {
    return res.status(404).send();
  }

  return res.send(bloodProductType);
};

exports.createBloodProductType = async (req, res) => {
  const { error } = validateBloodProductType(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodProductType = await bloodProductTypeService.createBloodProductType(req.body);
  return res.send(bloodProductType);
};

exports.updateBloodProductType = async (req, res) => {
  const { error } = validateBloodProductType(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.params;
  const bloodProductType = await bloodProductTypeService.updateBloodProductTypeById(id, req.body);

  if (!bloodProductType) {
    return res.status(404).send();
  }

  return res.send(bloodProductType);
};

exports.deleteBloodProductType = async (req, res) => {
  const { id } = req.params;
  const bloodProductType = await bloodProductTypeService.deleteBloodProductTypeById(id);

  if (!bloodProductType) {
    return res.status(404).send();
  }

  return res.send(bloodProductType);
};
