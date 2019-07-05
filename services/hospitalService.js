const mongoose = require('mongoose');
const Hospital = mongoose.model('Hospital');

exports.getHospitals = (paginationObj, filterObj, sortObj) => (
  Hospital.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getHospitalById = id => (
  Hospital
    .findById(id)
    .exec()
);

exports.createHospital = (hospital) => {
  const newHospital = new Hospital(hospital);
  return newHospital.save();
};

exports.updateHospitalById = (id, hospital) => (
  Hospital
    .findByIdAndUpdate(id,
      { $set: hospital },
      { new: true })
    .exec()
);

exports.deleteHospitalById = id => (
  Hospital
    .findByIdAndDelete(id)
    .exec()
);

exports.countHospitals = filterObj => (
  Hospital
    .find(filterObj)
    .countDocuments()
    .exec()
);
