const Joi = require('@hapi/joi');

const separationResultSchema = Joi.object().keys({
  bloodProductType: Joi.objectId().required(),
  volume: Joi.number().required(),
  expirationDate: Joi.date().required()
});

module.exports = separationResultSchema;
