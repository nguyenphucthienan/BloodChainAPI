const bloodCampService = require('../services/bloodCampService');
const { validateBloodCamp } = require('../validations/bloodCampValidations');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');

exports.getBloodCamps = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const authors = await bloodCampService.getBloodCamps(paginationObj, filterObj, sortObj);
  const totalItems = await bloodCampService.countBloodCamps(filterObj);

  const data = {
    items: authors,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodCamp = async (req, res) => {
  const { id } = req.params;
  const bloodCamp = await bloodCampService.getBloodCampById(id);

  if (!bloodCamp) {
    return res.status(404).send();
  }

  return res.send(bloodCamp);
};

exports.createBloodCamp = async (req, res) => {
  const { error } = validateBloodCamp(req.body);
  if (error) {
    return res.status(400).send(error.toString());
  }

  const bloodCamp = await bloodCampService.createBloodCamp(req.body);
  return res.send(bloodCamp);
};

exports.deleteBloodCamp = async (req, res) => {
  const { id } = req.params;
  const bloodCamp = await bloodCampService.deleteBloodCampById(id);

  if (!bloodCamp) {
    return res.status(404).send();
  }

  return res.send(bloodCamp);
};
