const mongoose = require('mongoose');
const Award = mongoose.model('Award');
const photoService = require('./photoService');

exports.getAwards = (paginationObj, filterObj, sortObj) => (
  Award.aggregate([
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
      $addFields: {
        quantity: { $size: '$codes' }
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        point: 1,
        codes: 1,
        quantity: 1,
        description: 1,
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

exports.getPublicAwards = (paginationObj, filterObj, sortObj) => (
  Award.aggregate([
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
      $addFields: {
        quantity: { $size: '$codes' }
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        point: 1,
        quantity: 1,
        description: 1,
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

exports.getAwardById = id => (
  Award
    .findById(id)
    .populate('photos', '_id url secureUrl')
    .select('-codes')
    .exec()
);

exports.createAward = (award) => {
  const newAward = new Award(award);
  return newAward.save();
};

exports.updateAwardById = (id, award) => (
  Award
    .findByIdAndUpdate(id,
      { $set: award },
      { new: true })
    .exec()
);

exports.deleteAwardById = id => (
  Award
    .findByIdAndDelete(id)
    .exec()
);

exports.countAwards = filterObj => (
  Award.find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadAwardPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await Award
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteAwardPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await Award
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
