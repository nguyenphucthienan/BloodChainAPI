const Joi = require('@hapi/joi');

exports.validateReward = (reward) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
    point: Joi.number().required(),
    description: Joi.string().min(3).max(1000).required()
  });

  return schema.validate(reward);
};
