const mongoose = require('mongoose');
const BloodTestCenter = mongoose.model('BloodTestCenter');

exports.getBloodTestCenters = (paginationObj, filterObj, sortObj) => (
  BloodTestCenter.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodTestCenterById = id => (
  BloodTestCenter
    .findById(id)
    .exec()
);

exports.createBloodTestCenter = (bloodTestCenter) => {
  const newBloodTestCenter = new BloodTestCenter(bloodTestCenter);
  return newBloodTestCenter.save();
};

exports.updateBloodTestCenterById = (id, bloodTestCenter) => (
  BloodTestCenter
    .findByIdAndUpdate(id,
      { $set: bloodTestCenter },
      { new: true })
    .exec()
);

exports.deleteBloodTestCenterById = id => (
  BloodTestCenter
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodTestCenters = filterObj => (
  BloodTestCenter
    .find(filterObj)
    .countDocuments()
    .exec()
);
