const Joi = require('@hapi/joi');
const pointSchema = require('./schemas/pointSchema');
const Genders = require('../constants/Genders');

exports.validateRegisterUser = (user) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.string().min(5).max(255),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    gender: Joi.string().required().valid([Genders.MALE, Genders.FEMALE, Genders.OTHER]),
    birthdate: Joi.date().required(),
    phone: Joi.string().max(255).required(),
    address: Joi.string().max(1000).required()
  });

  return schema.validate(user);
};

exports.validateCreateUser = (user) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    gender: Joi.string().required().valid([Genders.MALE, Genders.FEMALE, Genders.OTHER]),
    birthdate: Joi.date().required(),
    phone: Joi.string().max(255).required(),
    address: Joi.string().max(1000).required(),
    location: pointSchema
  });

  return schema.validate(user);
};

exports.validateEditUserInfo = (user) => {
  const schema = Joi.object().keys({
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    gender: Joi.string().required().valid([Genders.MALE, Genders.FEMALE, Genders.OTHER]),
    birthdate: Joi.date().required(),
    phone: Joi.string().max(255).required(),
    address: Joi.string().max(1000).required()
  });

  return schema.validate(user);
};

exports.validateChangeUserPassword = (user) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.string().min(5).max(255),
  });

  return schema.validate(user);
};
