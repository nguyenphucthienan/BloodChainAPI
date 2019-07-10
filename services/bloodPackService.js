const mongoose = require('mongoose');
const BloodPack = mongoose.model('BloodPack');
const BloodCamp = mongoose.model('BloodCamp');
const BloodTestCenter = mongoose.model('BloodTestCenter');

exports.getBloodPacks = (paginationObj, filterObj, sortObj) => (
  BloodPack.aggregate([
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
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        volume: 1,
        history: 1,
        'donor._id': 1,
        'donor.username': 1,
        'donor.firstName': 1,
        'donor.lastName': 1,
        'bloodCamp._id': 1,
        'bloodCamp.name': 1,
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodPackById = id => (
  BloodPack
    .findById(id)
    .populate('donor', '_id username firstName lastName')
    .populate('bloodCamp', '_id name')
    .exec()
);

exports.createBloodPack = (bloodPack) => {
  const newBloodPack = new BloodPack(bloodPack);
  return newBloodPack.save();
};

exports.updateBloodPackById = (id, bloodPack) => (
  BloodPack
    .findByIdAndUpdate(id,
      { $set: bloodPack },
      { new: true })
    .exec()
);

exports.deleteBloodPackById = id => (
  BloodPack
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodPacks = filterObj => (
  BloodPack
    .find(filterObj)
    .countDocuments()
    .exec()
);

exports.transferBloodPacksToBloodTestCenter = async (bloodCampId, bloodPackIds, bloodTestCenterId, description) => {
  const bloodCamp = await BloodCamp.findById(bloodCampId);
  if (!bloodCamp) {
    return { success: 0, errors: bloodPackIds.length };
  }

  const bloodTestCenter = await BloodTestCenter.findById(bloodTestCenterId);
  if (!bloodTestCenter) {
    return { success: 0, errors: bloodPackIds.length };
  }

  let success = 0, errors = 0;

  for (let bloodPackId of bloodPackIds) {
    const bloodPack = await BloodPack.findById(bloodPackId);
    if (bloodPack.currentLocation.toString() !== bloodCampId.toString()) {
      errors += 1;
      continue;
    }

    const updatedBloodPack = await BloodPack.findOneAndUpdate(
      {
        _id: bloodPackId,
        currentLocation: mongoose.Types.ObjectId(bloodCampId)
      },
      {
        $set: {
          bloodTestCenter: bloodTestCenterId,
          currentLocation: bloodTestCenterId
        },
        $push: {
          history: {
            from: { _id: bloodCampId, name: bloodCamp.name },
            to: { _id: bloodTestCenterId, name: bloodTestCenter.name },
            description
          }
        }
      },
      { new: true });

    if (!updatedBloodPack) {
      errors += 1;
    } else {
      success += 1;
    }
  }

  return { success, errors };
};
