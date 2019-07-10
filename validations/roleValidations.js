const Joi = require('@hapi/joi');

exports.validateRole = (role) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required()
  });

  return schema.validate(role);
};
