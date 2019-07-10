const Joi = require('@hapi/joi');

exports.validateTestType = (testType) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(1000).required()
  });

  return schema.validate(testType);
};
