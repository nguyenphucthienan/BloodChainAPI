const mongoose = require('mongoose');
const TestType = mongoose.model('TestType');

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

exports.deleteTestTypeById = id => (
  TestType
    .findByIdAndDelete(id)
    .exec()
);

exports.countTestTypes = filterObj => (
  TestType.find(filterObj)
    .countDocuments()
    .exec()
);
