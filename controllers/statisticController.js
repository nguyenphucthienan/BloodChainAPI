const userService = require('../services/userService');
const bloodPackService = require('../services/bloodPackService');
const bloodProductService = require('../services/bloodProductService');

exports.getLandingStatistics = async (req, res) => {
  const countPromises = [
    userService.countUsers({}),
    bloodPackService.countBloodPacks({}),
    bloodProductService.countBloodProducts({ used: true })
  ];

  const countData = await Promise.all(countPromises);
  const userCount = countData[0];
  const bloodPackCount = countData[1];
  const savedPatientCount = countData[2];

  const data = {
    users: userCount,
    bloodPacks: bloodPackCount,
    savedPatients: savedPatientCount
  };

  return res.send(data);
}

exports.getAdminStatistics = async (req, res) => {
  const countPromises = [
    userService.countUsers({}),
    bloodPackService.countBloodPacks({}),
    bloodProductService.countBloodProducts({ used: true })
  ];

  const countData = await Promise.all(countPromises);
  const userCount = countData[0];
  const bloodPackCount = countData[1];
  const savedPatientCount = countData[2];

  const data = {
    users: userCount,
    bloodPacks: bloodPackCount,
    savedPatients: savedPatientCount
  };

  return res.send(data);
}
