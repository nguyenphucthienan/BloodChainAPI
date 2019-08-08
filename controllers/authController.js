const _ = require('lodash');
const userService = require('../services/userService');
const photoService = require('../services/photoService');
const {
  validateRegisterUser,
  validateUpdateUser,
  validateChangeUserPassword
} = require('../validations/userValidations');

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
  const { username } = req.query;
  const user = await userService.getUserByUsername(username);

  if (user) {
    return res.json({ exists: true });
  }

  return res.json({ exists: false });
};

exports.checkEmail = async (req, res) => {
  const { email } = req.query;
  const user = await userService.getUserByEmail(email);

  if (user) {
    return res.json({ exists: true });
  }

  return res.json({ exists: false });
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
  const { error } = validateUpdateUser(req.body);
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

exports.changePhoto = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Photo is invalid' });
  }

  const photo = await photoService.uploadPhoto(file);
  if (!photo) {
    return res.status(500).send({ message: 'Upload photo failed' });
  }

  const { id } = req.user;
  const updatedUser = await userService.updateUserById(id, { photo: photo._id });

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

exports.getMyUserInfoOnBlockChain = async (req, res) => {
  const { id } = req.user;
  const user = await userService.getUserById(id);

  if (!user) {
    return res.status(404).send();
  }

  const userInfo = await userService.getUserInfoOnBlockChainById(id);
  return res.send(userInfo);
};
