const Joi = require('@hapi/joi');
const pointSchema = require('./schemas/pointSchema');

exports.validateRegisterUser = (user) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    phone: Joi.string().max(255)
  });

  return schema.validate(user);
};

exports.validateCreateUser = (user) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    phone: Joi.string().max(255),
    address: Joi.string().max(1000).required(),
    location: pointSchema
  });

  return schema.validate(user);
};
