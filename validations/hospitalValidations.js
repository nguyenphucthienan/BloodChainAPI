const Joi = require('@hapi/joi');
const pointSchema = require('./schemas/pointSchema');

exports.validateHospital = (hospital) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().max(255).email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(3).max(1000).required(),
    location: pointSchema
  });

  return schema.validate(hospital);
};
