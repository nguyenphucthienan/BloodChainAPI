const Joi = require('@hapi/joi');

const testResultSchema = Joi.object().keys({
  testType: Joi.objectId().required(),
  passed: Joi.boolean().required()
});

module.exports = testResultSchema;
