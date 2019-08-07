const Joi = require('@hapi/joi');

exports.validateCampaign = (campaign) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().required()
  });

  return schema.validate(campaign);
};
