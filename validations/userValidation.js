const Joi = require('@hapi/joi');

exports.validateUser = (user) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required()
  });

  return schema.validate(user);
};
