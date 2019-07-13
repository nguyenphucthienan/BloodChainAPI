const Joi = require('@hapi/joi');
const BloodTypes = require('../constants/BloodTypes');

exports.validateCreateBloodProduct = (bloodProduct) => {
  const schema = Joi.object().keys({
    donor: Joi.objectId().required(),
    bloodPack: Joi.objectId().required(),
    bloodSeparationCenter: Joi.objectId().required(),
    volume: Joi.number().required(),
    bloodType: Joi.string().required().valid([
      BloodTypes.A_POSITIVE,
      BloodTypes.A_NEGATIVE,
      BloodTypes.B_POSITIVE,
      BloodTypes.B_NEGATIVE,
      BloodTypes.O_POSITIVE,
      BloodTypes.O_NEGATIVE,
      BloodTypes.AB_POSITIVE,
      BloodTypes.AB_NEGATIVE
    ]),
    expirationDate: Joi.date().required(),
    description: Joi.string()
  });

  return schema.validate(bloodProduct);
};
