const _ = require('lodash');
const userService = require('../services/userService');
const { validateUser } = require('../validations/userValidation');

exports.register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.toString());
  }

  const {
    username,
    password,
    firstName,
    lastName
  } = req.body;

  const user = await userService.getUserByUsername(username);
  if (user) {
    return res.status(409).send({ message: 'Username already exists' });
  }

  const newUser = await userService.createUser(username, password, firstName, lastName);
  const token = newUser.generateToken();
  return res.json({ token });
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
  const token = user.generateToken();
  return res.json({ token });
};

exports.currentUser = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  const returnUser = _.omit(user.toObject(), ['password']);
  return res.json(returnUser);
};
