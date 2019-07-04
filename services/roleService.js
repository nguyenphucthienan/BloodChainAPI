const mongoose = require('mongoose');
const Role = mongoose.model('Role');

exports.getAllRoles = () => Role.find().exec();

exports.getRoles = (paginationObj, filterObj, sortObj) => (
  Role.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getRoleById = id => (
  Role
    .findById(id)
    .exec()
);

exports.createRole = (role) => {
  const newRole = new Role(role);
  return newRole.save();
};

exports.deleteRoleById = id => (
  Role
    .findByIdAndDelete(id)
    .exec()
);

exports.countRoles = filterObj => (
  Role.find(filterObj)
    .countDocuments()
    .exec()
);
