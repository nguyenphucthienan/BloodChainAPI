const mongoose = require('mongoose');
const TestType = mongoose.model('TestType');
const bloodPackService = require('./bloodPackService');

exports.getAllTestTypes = () => TestType.find().exec();

exports.getTestTypes = (paginationObj, filterObj, sortObj) => (
  TestType.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getTestTypeById = id => (
  TestType
    .findById(id)
    .exec()
);

exports.createTestType = (testType) => {
  const newTestType = new TestType(testType);
  return newTestType.save();
};

exports.updateTestTypeById = (id, testType) => (
  TestType
    .findByIdAndUpdate(id,
      { $set: testType },
      { new: true })
    .exec()
);

exports.deleteTestTypeById = async id => {
  const bloodPackCount = await bloodPackService.countBloodPacks({
    'testResults.testType': mongoose.Types.ObjectId(id)
  });

  if (bloodPackCount > 0) {
    throw new Error('Test type is in use');
  }

  return TestType
    .findByIdAndDelete(id)
    .exec()
};

exports.countTestTypes = filterObj => (
  TestType.find(filterObj)
    .countDocuments()
    .exec()
);
