const mongoose = require('mongoose');
const BloodCamp = mongoose.model('BloodCamp');

exports.getBloodCamps = () => BloodCamp.find().exec();

exports.getBloodCampById = id => (
  BloodCamp.findById(id).exec()
);

exports.createBloodCamp = (bloodCamp) => {
  const newBloodCamp = new BloodCamp(bloodCamp);
  return newBloodCamp.save();
};

exports.deleteBloodCampById = id => (
  BloodCamp.findByIdAndDelete(id).exec()
);
