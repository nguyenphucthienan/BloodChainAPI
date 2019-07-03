const _ = require('lodash');
const userService = require('../services/userService');
const BcryptUtils = require('../utils/BcryptUtils');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateUser } = require('../validations/userValidation');

exports.getUsers = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const users = await userService.getUsers(paginationObj, filterObj, sortObj);
  const totalItems = await userService.countUsers(filterObj);

  const data = {
    items: users,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (!user) {
    return res.status(404).send();
  }

  return res.send(user);
};

exports.createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { username, email } = req.body;
  let user = await userService.getUserByUsername(username);
  if (user) {
    return res.status(409).send({ message: 'Username already exists' });
  }

  user = await userService.getUserByEmail(email);
  if (user) {
    return res.status(409).send({ message: 'Email has been used' });
  }

  const newUser = await userService.createUser(req.body);
  const returnUser = _.omit(newUser.toObject(), ['password']);
  return res.send(returnUser);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  let hashedPassword;
  if (req.body.password) {
    hashedPassword = await BcryptUtils.hashPassword(req.body.password);
    if (!hashedPassword) {
      return res.status(500).send();
    }
  }

  const user = { ...req.body, password: hashedPassword };
  const updatedUser = await userService.updateUserById(id, user);

  if (!updatedUser) {
    return res.status(404).send();
  }

  const returnUser = _.omit(updatedUser.toObject(), ['password']);
  return res.send(returnUser);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.deleteUserById(id);

  if (!user) {
    return res.status(404).send();
  }

  return res.send(user);
};
