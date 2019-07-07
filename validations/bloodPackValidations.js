const Joi = require('@hapi/joi');

exports.validateCreateBloodPack = (bloodPack) => {
  const schema = Joi.object().keys({
    donor: Joi.objectId().required(),
    volume: Joi.number().required()
  });

  return schema.validate(bloodPack);
};
