const mongoose = require('mongoose');
const BloodCamp = mongoose.model('BloodCamp');
const photoService = require('./photoService');

exports.getBloodCamps = (paginationObj, filterObj, sortObj) => (
  BloodCamp.aggregate([
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

exports.getBloodCampById = id => (
  BloodCamp
    .findById(id)
    .populate('photos', '_id url secureUrl')
    .exec()
);

exports.createBloodCamp = (bloodCamp) => {
  const newBloodCamp = new BloodCamp(bloodCamp);
  return newBloodCamp.save();
};

exports.updateBloodCampById = (id, bloodCamp) => (
  BloodCamp
    .findByIdAndUpdate(id,
      { $set: bloodCamp },
      { new: true })
    .exec()
);

exports.deleteBloodCampById = id => (
  BloodCamp
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodCamps = filterObj => (
  BloodCamp
    .find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadBloodCampPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await BloodCamp
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};
