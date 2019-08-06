const mongoose = require('mongoose');
const BloodSeparationCenter = mongoose.model('BloodSeparationCenter');
const photoService = require('./photoService');

exports.getBloodSeparationCenters = (paginationObj, filterObj, sortObj) => (
  BloodSeparationCenter.aggregate([
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

exports.getBloodSeparationCenterById = id => (
  BloodSeparationCenter
    .findById(id)
    .populate('photos', '_id url secureUrl')
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

exports.uploadBloodSeparationCenterPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await BloodSeparationCenter
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteBloodSeparationCenterPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await BloodSeparationCenter
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
