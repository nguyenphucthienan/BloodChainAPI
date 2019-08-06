const mongoose = require('mongoose');
const Hospital = mongoose.model('Hospital');
const photoService = require('./photoService');

exports.getHospitals = (paginationObj, filterObj, sortObj) => (
  Hospital.aggregate([
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

exports.getHospitalById = id => (
  Hospital
    .findById(id)
    .populate('photos', '_id url secureUrl')
    .exec()
);

exports.createHospital = (hospital) => {
  const newHospital = new Hospital(hospital);
  return newHospital.save();
};

exports.updateHospitalById = (id, hospital) => (
  Hospital
    .findByIdAndUpdate(id,
      { $set: hospital },
      { new: true })
    .exec()
);

exports.deleteHospitalById = id => (
  Hospital
    .findByIdAndDelete(id)
    .exec()
);

exports.countHospitals = filterObj => (
  Hospital
    .find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadHospitalPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await Hospital
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteHospitalPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await Hospital
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};
