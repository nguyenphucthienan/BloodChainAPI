const mongoose = require('mongoose');
const BloodProduct = mongoose.model('BloodProduct');

exports.getBloodProducts = (paginationObj, filterObj, sortObj) => (
  BloodProduct.aggregate([
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
        from: 'bloodseparationcenters',
        localField: 'bloodSeparationCenter',
        foreignField: '_id',
        as: 'bloodSeparationCenter'
      }
    },
    {
      $unwind: {
        path: '$bloodSeparationCenter',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        volume: 1,
        bloodType: 1,
        description: 1,
        currentLocation: 1,
        history: 1,
        'donor._id': 1,
        'donor.username': 1,
        'donor.firstName': 1,
        'donor.lastName': 1,
        'bloodSeparationCenter._id': 1,
        'bloodSeparationCenter.name': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodProductById = id => (
  BloodProduct
    .findById(id)
    .populate('donor', '_id username firstName lastName')
    .populate('bloodPack', '_id bloodType')
    .populate('bloodSeparationCenter', '_id name')
    .exec()
);

exports.createBloodProduct = (bloodProduct) => {
  const newBloodProduct = new BloodProduct(bloodProduct);
  return newBloodProduct.save();
};

exports.updateBloodProductById = (id, bloodProduct) => (
  BloodProduct
    .findByIdAndUpdate(id,
      { $set: bloodProduct },
      { new: true })
    .exec()
);

exports.deleteBloodProductById = id => (
  BloodProduct
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodProducts = filterObj => (
  BloodProduct
    .find(filterObj)
    .countDocuments()
    .exec()
);
