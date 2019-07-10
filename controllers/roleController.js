const roleService = require('../services/roleService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateRole } = require('../validations/roleValidations');

exports.getRoles = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const roles = await roleService.getRoles(paginationObj, filterObj, sortObj);
  const totalItems = await roleService.countRoles(filterObj);

  const data = {
    items: roles,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getRole = async (req, res) => {
  const { id } = req.params;
  const role = await roleService.getRoleById(id);

  if (!role) {
    return res.status(404).send();
  }

  return res.send(role);
};

exports.createRole = async (req, res) => {
  const { error } = validateRole(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const role = await roleService.createRole(req.body);
  return res.send(role);
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  const role = await roleService.deleteRoleById(id);

  if (!role) {
    return res.status(404).send();
  }

  return res.send(role);
};
