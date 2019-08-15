const mongoose = require('mongoose');
const Reward = mongoose.model('Reward');
const photoService = require('./photoService');

exports.getRewards = (paginationObj, filterObj, sortObj) => (
  Reward.aggregate([
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

exports.getPublicRewards = (paginationObj, filterObj, sortObj) => (
  Reward.aggregate([
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

exports.getRewardById = id => (
  Reward
    .findById(id)
    .populate('photos', '_id url secureUrl')
    .select('-codes')
    .exec()
);

exports.createReward = (reward) => {
  const newReward = new Reward(reward);
  return newReward.save();
};

exports.updateRewardById = (id, reward) => (
  Reward
    .findByIdAndUpdate(id,
      { $set: reward },
      { new: true })
    .exec()
);

exports.deleteRewardById = id => (
  Reward
    .findByIdAndDelete(id)
    .exec()
);

exports.countRewards = filterObj => (
  Reward.find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadRewardPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await Reward
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteRewardPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await Reward
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
