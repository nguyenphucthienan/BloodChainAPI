const bloodProductService = require('../services/bloodProductService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');

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
