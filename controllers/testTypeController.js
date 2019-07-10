const testTypeService = require('../services/testTypeService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateTestType } = require('../validations/testTypeValidations');

exports.getAllTestTypes = async (req, res) => {
  const testTypes = await testTypeService.getAllTestTypes();
  return res.send(testTypes);
}

exports.getTestTypes = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const testTypes = await testTypeService.getTestTypes(paginationObj, filterObj, sortObj);
  const totalItems = await testTypeService.countTestTypes(filterObj);

  const data = {
    items: testTypes,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getTestType = async (req, res) => {
  const { id } = req.params;
  const testType = await testTypeService.getTestTypeById(id);

  if (!testType) {
    return res.status(404).send();
  }

  return res.send(testType);
};

exports.createTestType = async (req, res) => {
  const { error } = validateTestType(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const testType = await testTypeService.createTestType(req.body);
  return res.send(testType);
};

exports.deleteTestType = async (req, res) => {
  const { id } = req.params;
  const testType = await testTypeService.deleteTestTypeById(id);

  if (!testType) {
    return res.status(404).send();
  }

  return res.send(testType);
};
