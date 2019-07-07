const mongoose = require('mongoose');
const BloodPack = mongoose.model('BloodPack');

exports.getBloodPacks = (paginationObj, filterObj, sortObj) => (
  BloodPack.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'users',
        localField: 'donor',
        foreignField: '_id',
        as: 'donor'
      }
    },
    {
      $unwind: {
        path: '$donor',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'bloodcamps',
        localField: 'bloodCamp',
        foreignField: '_id',
        as: 'bloodCamp'
      }
    },
    {
      $unwind: {
        path: '$bloodCamp',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        volume: 1,
        history: 1,
        'donor._id': 1,
        'donor.username': 1,
        'donor.firstName': 1,
        'donor.lastName': 1,
        'bloodCamp._id': 1,
        'bloodCamp.name': 1,
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodPackById = id => (
  BloodPack
    .findById(id)
    .exec()
);

exports.createBloodPack = (bloodPack) => {
  const newBloodPack = new BloodPack(bloodPack);
  return newBloodPack.save();
};

exports.updateBloodPackById = (id, bloodPack) => (
  BloodPack
    .findByIdAndUpdate(id,
      { $set: bloodPack },
      { new: true })
    .exec()
);

exports.deleteBloodPackById = id => (
  BloodPack
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodPacks = filterObj => (
  BloodPack
    .find(filterObj)
    .countDocuments()
    .exec()
);
