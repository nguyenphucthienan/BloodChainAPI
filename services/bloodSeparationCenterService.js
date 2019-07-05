const mongoose = require('mongoose');
const BloodSeparationCenter = mongoose.model('BloodSeparationCenter');

exports.getBloodSeparationCenters = (paginationObj, filterObj, sortObj) => (
  BloodSeparationCenter.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodSeparationCenterById = id => (
  BloodSeparationCenter
    .findById(id)
    .exec()
);

exports.createBloodSeparationCenter = (bloodSeparationCenter) => {
  const newBloodSeparationCenter = new BloodSeparationCenter(bloodSeparationCenter);
  return newBloodSeparationCenter.save();
};

exports.updateBloodSeparationCenterById = (id, bloodSeparationCenter) => (
  BloodSeparationCenter
    .findByIdAndUpdate(id,
      { $set: bloodSeparationCenter },
      { new: true })
    .exec()
);

exports.deleteBloodSeparationCenterById = id => (
  BloodSeparationCenter
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodSeparationCenters = filterObj => (
  BloodSeparationCenter
    .find(filterObj)
    .countDocuments()
    .exec()
);
