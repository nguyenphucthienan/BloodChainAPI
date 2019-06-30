const mongoose = require('mongoose');
const Role = mongoose.model('Role');

exports.getRoles = () => Role.find().exec();

exports.getRoleById = id => (
  Role.findById(id).exec()
);

exports.createRole = (name) => {
  const newRole = new Role({ name });
  return newRole.save();
};

exports.deleteRoleById = id => (
  Role.findByIdAndDelete(id).exec()
);
