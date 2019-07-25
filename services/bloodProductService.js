const mongoose = require('mongoose');
const BloodProduct = mongoose.model('BloodProduct');
const BloodSeparationCenter = mongoose.model('BloodSeparationCenter');
const BloodBank = mongoose.model('BloodBank');
const Hospital = mongoose.model('Hospital');
const RoleNames = require('../constants/RoleNames');
const TransferTypes = require('../constants/TransferTypes');
const web3BloodChainService = require('./web3/web3BloodChainService');
const web3BloodPackService = require('./web3/web3BloodPackService');

exports.getBloodProducts = (paginationObj, filterObj, sortObj) => (
  BloodProduct.aggregate([
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
      $lookup: {
        from: 'bloodproducttypes',
        localField: 'bloodProductType',
        foreignField: '_id',
        as: 'bloodProductType'
      }
    },
    {
      $unwind: {
        path: '$bloodProductType',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        volume: 1,
        bloodPack: 1,
        bloodType: 1,
        expirationDate: 1,
        description: 1,
        currentLocation: 1,
        history: 1,
        'donor._id': 1,
        'donor.username': 1,
        'donor.firstName': 1,
        'donor.lastName': 1,
        'bloodSeparationCenter._id': 1,
        'bloodSeparationCenter.name': 1,
        'bloodProductType._id': 1,
        'bloodProductType.name': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodProductsByBloodPackId = (bloodPackId) => (
  BloodProduct
    .find({ bloodPack: mongoose.Types.ObjectId(bloodPackId) })
    .populate('donor', '_id username firstName lastName')
    .populate('bloodPack', '_id bloodType')
    .populate('bloodSeparationCenter', '_id name')
    .populate('bloodProductType', '_id name')
    .exec()
);

exports.getBloodProductById = id => (
  BloodProduct
    .findById(id)
    .populate('donor', '_id username firstName lastName')
    .populate('bloodPack', '_id bloodType')
    .populate('bloodSeparationCenter', '_id name')
    .populate('bloodProductType', '_id name')
    .exec()
);

exports.createBloodProduct = (bloodProduct) => {
  const newBloodProduct = new BloodProduct(bloodProduct);
  return newBloodProduct.save();
};

exports.updateBloodProductById = (id, bloodProduct) => (
  BloodProduct
    .findByIdAndUpdate(id,
      { $set: bloodProduct },
      { new: true })
    .exec()
);

exports.deleteBloodProductById = id => (
  BloodProduct
    .findByIdAndDelete(id)
    .exec()
);

exports.countBloodProducts = filterObj => (
  BloodProduct
    .find(filterObj)
    .countDocuments()
    .exec()
);

exports.transferBloodProducts = async (
  fromOrganizationType, fromOrganizationId,
  toOrganizationType, toOrganizationId,
  bloodProductIds, description
) => {
  let fromOrganization;
  switch (fromOrganizationType) {
    case RoleNames.BLOOD_SEPARATION_CENTER:
      fromOrganization = await BloodSeparationCenter.findById(fromOrganizationId);
      break;
    case RoleNames.BLOOD_BANK:
      fromOrganization = await BloodBank.findById(fromOrganizationId);
      break;
    case RoleNames.HOSPITAL:
      fromOrganization = await Hospital.findById(fromOrganizationId);
      break;
  }

  if (!fromOrganization) {
    return { success: [], errors: bloodProductIds };
  }

  let toOrganization;
  switch (toOrganizationType) {
    case RoleNames.BLOOD_BANK:
      toOrganization = await BloodBank.findById(toOrganizationId);
      break;
    case RoleNames.HOSPITAL:
      toOrganization = await Hospital.findById(toOrganizationId);
      break;
  }

  if (!toOrganization) {
    return { success: [], errors: bloodProductIds };
  }

  const success = [], errors = [];
  for (let bloodProductId of bloodProductIds) {
    const bloodProduct = await BloodProduct.findById(bloodProductId);
    if (bloodProduct.currentLocation.toString() !== fromOrganizationId.toString()) {
      errors.push(bloodProductId);
      continue;
    }

    const updatedBloodProduct = await BloodProduct.findOneAndUpdate(
      {
        _id: bloodProductId,
        currentLocation: mongoose.Types.ObjectId(fromOrganizationId)
      },
      {
        $set: {
          currentLocation: toOrganizationId
        },
        $push: {
          history: {
            from: { _id: fromOrganizationId, name: fromOrganization.name },
            to: { _id: toOrganizationId, name: toOrganization.name },
            description
          }
        }
      },
      { new: true }
    );

    if (updatedBloodProduct) {
      try {
        const bloodPackId = updatedBloodProduct.bloodPack.toString()
        const bloodPackAddress = await web3BloodChainService.getBloodPackAddress(bloodPackId);
        await web3BloodPackService.transfer(
          bloodPackAddress,
          TransferTypes.TRANSFER_BLOOD_PRODUCT, bloodProductId,
          fromOrganizationType, fromOrganizationId.toString(), fromOrganization.name,
          toOrganizationType, toOrganizationId.toString(), toOrganization.name,
          description
        );

        success.push(bloodProductId);
      } catch (error) {
        errors.push(bloodProductId);
      }
    } else {
      errors.push(bloodProductId);
    }
  }

  return { success, errors };
};
