const Joi = require('@hapi/joi');

const separationResultSchema = Joi.object()
  .keys({
    _id: Joi.string().allow(null),
    bloodProductType: Joi.objectId().required(),
    volume: Joi.number().required(),
    expirationDate: Joi.date().required()
  });

module.exports = separationResultSchema;
