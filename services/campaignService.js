const mongoose = require('mongoose');
const Campaign = mongoose.model('Campaign');
const photoService = require('./photoService');

exports.getCampaigns = (paginationObj, filterObj, sortObj) => (
  Campaign.aggregate([
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
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos'
      }
    },
    { $match: filterObj },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        bloodCamp: 1,
        startDate: 1,
        endDate: 1,
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

exports.getCampaignById = id => (
  Campaign
    .findById(id)
    .populate({
      path: 'bloodCamp',
      populate: {
        path: 'photos',
        model: 'Photo',
        select: '_id url secureUrl'
      }
    })
    .populate('photos', '_id url secureUrl')
    .exec()
);

exports.createCampaign = (campaign) => {
  const newCampaign = new Campaign(campaign);
  return newCampaign.save();
};

exports.updateCampaignById = (id, campaign) => (
  Campaign
    .findByIdAndUpdate(id,
      { $set: campaign },
      { new: true })
    .exec()
);

exports.deleteCampaignById = id => (
  Campaign
    .findByIdAndDelete(id)
    .exec()
);

exports.countCampaigns = filterObj => (
  Campaign
    .find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadCampaignPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await Campaign
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteCampaignPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await Campaign
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
