const _ = require('lodash');
const userService = require('../services/userService');
const { validateRegisterUser, validateEditUserInfo, validateChangeUserPassword } = require('../validations/userValidation');

exports.register = async (req, res) => {
  const { error } = validateRegisterUser(req.body);
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

  const newUser = await userService.registerUser(req.body);
  const token = newUser.generateToken();
  return res.send({ token });
};

exports.checkUsername = async (req, res) => {
  const { username } = req.body;
  const user = await userService.getUserByUsername(username);

  if (!user) {
    return res.json({ result: true });
  }

  return res.json({ result: false });
};

exports.logIn = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  const accessToken = user.generateToken();
  return res.json({ accessToken });
};

exports.currentUser = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  const returnUser = _.omit(user.toObject(), ['password']);
  return res.json(returnUser);
};

exports.editInfo = async (req, res) => {
  const { error } = validateEditUserInfo(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.user;
  const updatedUser = await userService.updateUserById(id, req.body);

  if (!updatedUser) {
    return res.status(404).send();
  }

  const returnUser = _.omit(updatedUser.toObject(), ['password']);
  return res.send(returnUser);
};

exports.changePassword = async (req, res) => {
  const { error } = validateChangeUserPassword(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const { id } = req.user;
  const { password } = req.body;

  const updatedUser = await userService.updateUserById(id, { password });
  if (!updatedUser) {
    return res.status(404).send();
  }

  const returnUser = _.omit(updatedUser.toObject(), ['password']);
  return res.send(returnUser);
};
