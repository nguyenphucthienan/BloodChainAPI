const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');

exports.getPhotos = (paginationObj, filterObj, sortObj) => (
  Photo.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getPhotoById = id => (
  Photo
    .findById(id)
    .exec()
);

exports.uploadPhoto = (file, description) => {
  const dataUri = new Datauri();
  dataUri.format('.png', file.buffer);

  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader
        .upload(dataUri.content, async response => {
          const newPhoto = new Photo({
            url: response.url,
            secureUrl: response.secure_url,
            description
          });

          const photo = await newPhoto.save();
          if (!photo) {
            reject();
          }

          resolve(photo);
        });
    } catch (error) {
      reject();
    }
  });
};

exports.updatePhotoById = (id, photo) => (
  Photo
    .findByIdAndUpdate(id,
      { $set: photo },
      { new: true })
    .exec()
);

exports.deletePhotoById = id => (
  Photo
    .findByIdAndDelete(id)
    .exec()
);

exports.countPhotos = filterObj => (
  Photo.find(filterObj)
    .countDocuments()
    .exec()
);
