const Joi = require('@hapi/joi');

const pointSchema = Joi.object()
  .keys({
    type: Joi.string().required().valid(['Point']),
    coordinates: Joi.array().ordered([
      Joi.number().min(-180).max(180).required(),
      Joi.number().min(-90).max(90).required()
    ])
  })
  .description('Please use this format [longitude, latitude]');

module.exports = pointSchema;
