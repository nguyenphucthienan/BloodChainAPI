const mongoose = require('mongoose');
const BloodPack = mongoose.model('BloodPack');
const BloodCamp = mongoose.model('BloodCamp');
const BloodTestCenter = mongoose.model('BloodTestCenter');
const BloodSeparationCenter = mongoose.model('BloodSeparationCenter');
const TestType = mongoose.model('TestType');
const BloodProductType = mongoose.model('BloodProductType');
const bloodProductService = require('./bloodProductService');

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
      $lookup: {
        from: 'bloodtestcenters',
        localField: 'bloodTestCenter',
        foreignField: '_id',
        as: 'bloodTestCenter'
      }
    },
    {
      $unwind: {
        path: '$bloodTestCenter',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'bloodseparationcenters',
        localField: 'bloodSeparationCenter',
        foreignField: '_id',
        as: 'bloodSeparationCenter'
      }
    },
    {
      $unwind: {
        path: '$bloodSeparationCenter',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        volume: 1,
        bloodType: 1,
        tested: 1,
        testPassed: 1,
        testDescription: 1,
        separated: 1,
        currentLocation: 1,
        history: 1,
        'donor._id': 1,
        'donor.username': 1,
        'donor.firstName': 1,
        'donor.lastName': 1,
        'bloodCamp._id': 1,
        'bloodCamp.name': 1,
        'bloodTestCenter._id': 1,
        'bloodTestCenter.name': 1,
        'bloodSeparationCenter._id': 1,
        'bloodSeparationCenter.name': 1
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
    .populate('bloodTestCenter', '_id name')
    .populate('bloodSeparationCenter', '_id name')
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

exports.updateTestResultsById = async (id, bloodType, testResults, testDescription) => {
  const validTestResults = [];
  for (let testResult of testResults) {
    const testType = await TestType.findById(testResult.testType);
    if (testType) {
      validTestResults.push(testResult);
    }
  }

  const testPassed = validTestResults.every(result => result.passed);
  const bloodPack = await BloodPack.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    {
      $set: {
        bloodType,
        tested: true,
        testPassed,
        testResults: validTestResults,
        testDescription
      }
    },
    { new: true }
  );

  return bloodPack;
};

exports.updateSeparationResultsById = async (id, separationResults, separationDescription) => {
  const bloodPack = await BloodPack.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    {
      $set: {
        separated: true,
        separationDescription
      }
    },
    { new: true }
  );

  const success = [];
  if (bloodPack) {
    for (let separationResult of separationResults) {
      const bloodProductType = await BloodProductType.findById(separationResult.bloodProductType);

      if (bloodProductType) {
        const newBloodProduct = {
          donor: bloodPack.donor,
          bloodPack: bloodPack._id,
          bloodSeparationCenter: bloodPack.bloodSeparationCenter,
          bloodProductType: separationResult.bloodProductType,
          volume: separationResult.volume,
          bloodType: bloodPack.bloodType,
          expirationDate: separationResult.expirationDate,
          currentLocation: bloodPack.bloodSeparationCenter
        };

        const bloodProduct = await bloodProductService.createBloodProduct(newBloodProduct);
        if (bloodProduct) {
          success.push(bloodProduct._id);
        }
      }
    }
  }

  return bloodPack;
};

exports.transferBloodPacksToBloodTestCenter = async (
  bloodCampId,
  bloodPackIds,
  bloodTestCenterId,
  description) => {
  const bloodCamp = await BloodCamp.findById(bloodCampId);
  if (!bloodCamp) {
    return { success: [], errors: bloodPackIds };
  }

  const bloodTestCenter = await BloodTestCenter.findById(bloodTestCenterId);
  if (!bloodTestCenter) {
    return { success: [], errors: bloodPackIds };
  }

  const success = [], errors = [];
  for (let bloodPackId of bloodPackIds) {
    const bloodPack = await BloodPack.findById(bloodPackId);
    if (bloodPack.currentLocation.toString() !== bloodCampId.toString()) {
      errors.push(bloodPackId);
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
      { new: true }
    );

    if (!updatedBloodPack) {
      errors.push(bloodPackId);
    } else {
      success.push(bloodPackId);
    }
  }

  return { success, errors };
};

exports.transferBloodPacksToBloodSeparationCenter = async (
  bloodTestCenterId,
  bloodPackIds,
  bloodSeparationCenterId,
  description) => {

  const bloodTestCenter = await BloodTestCenter.findById(bloodTestCenterId);
  if (!bloodTestCenter) {
    return { success: [], errors: bloodPackIds };
  }

  const bloodSeparationCenter = await BloodSeparationCenter.findById(bloodSeparationCenterId);
  if (!bloodSeparationCenter) {
    return { success: [], errors: bloodPackIds };
  }

  const success = [], errors = [];
  for (let bloodPackId of bloodPackIds) {
    const bloodPack = await BloodPack.findById(bloodPackId);
    if (bloodPack.currentLocation.toString() !== bloodTestCenterId.toString()) {
      errors.push(bloodPackId);
      continue;
    }

    const updatedBloodPack = await BloodPack.findOneAndUpdate(
      {
        _id: bloodPackId,
        tested: true,
        testPassed: true,
        currentLocation: mongoose.Types.ObjectId(bloodTestCenterId)
      },
      {
        $set: {
          bloodSeparationCenter: bloodSeparationCenterId,
          currentLocation: bloodSeparationCenterId
        },
        $push: {
          history: {
            from: { _id: bloodTestCenterId, name: bloodTestCenter.name },
            to: { _id: bloodSeparationCenterId, name: bloodSeparationCenter.name },
            description
          }
        }
      },
      { new: true }
    );

    if (!updatedBloodPack) {
      errors.push(bloodPackId);
    } else {
      success.push(bloodPackId);
    }
  }

  return { success, errors };
};
