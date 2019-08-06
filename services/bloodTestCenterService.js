const mongoose = require('mongoose');
const BloodTestCenter = mongoose.model('BloodTestCenter');
const photoService = require('./photoService');

exports.getBloodTestCenters = (paginationObj, filterObj, sortObj) => (
  BloodTestCenter.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos'
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        location: 1,
        'photos._id': 1,
        'photos.url': 1,
        'photos.secureUrl': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodTestCenterById = id => (
  BloodTestCenter
    .findById(id)
    .populate('photos', '_id url secureUrl')
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

exports.uploadBloodTestCenterPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await BloodTestCenter
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteBloodTestCenterPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await BloodTestCenter
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
