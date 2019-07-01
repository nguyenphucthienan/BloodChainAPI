const mongoose = require('mongoose');
const BloodCamp = mongoose.model('BloodCamp');

exports.getBloodCamps = (paginationObj, filterObj, sortObj) => (
  BloodCamp.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

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

exports.countBloodCamps = filterObj => (
  BloodCamp.find(filterObj).countDocuments().exec()
);
