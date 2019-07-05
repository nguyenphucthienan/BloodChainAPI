const mongoose = require('mongoose');
const BloodBank = mongoose.model('BloodBank');

exports.getBloodBanks = (paginationObj, filterObj, sortObj) => (
  BloodBank.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodBankById = id => (
  BloodBank
    .findById(id)
    .exec()
);

exports.createBloodBank = (bloodBank) => {
  const newBloodBank = new BloodBank(bloodBank);
  return newBloodBank.save();
};

exports.updateBloodBankById = (id, bloodBank) => (
  BloodBank
    .findByIdAndUpdate(id,
      { $set: bloodBank },
      { new: true })
    .exec()
);

exports.deleteBloodBankById = id => (
  BloodBank
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodBanks = filterObj => (
  BloodBank
    .find(filterObj)
    .countDocuments()
    .exec()
);
