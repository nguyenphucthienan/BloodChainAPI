const mongoose = require('mongoose');
const BloodBank = mongoose.model('BloodBank');
const photoService = require('./photoService');

exports.getBloodBanks = (paginationObj, filterObj, sortObj) => (
  BloodBank.aggregate([
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

exports.getBloodBankById = id => (
  BloodBank
    .findById(id)
    .populate('photos', '_id url secureUrl')
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

exports.uploadBloodBankPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await BloodBank
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteBloodBankPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await BloodBank
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
