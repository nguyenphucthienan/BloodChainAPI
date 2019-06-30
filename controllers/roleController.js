const roleService = require('../services/roleService');
const { validateRole } = require('../validations/roleValidation');

exports.getRoles = async (req, res) => {
  const roles = await roleService.getRoles();
  return res.send(roles);
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
    return res.status(400).send(error.toString());
  }

  const { name } = req.body;
  const role = await roleService.createRole(name);
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
