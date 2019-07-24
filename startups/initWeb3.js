const winston = require('winston');
const web3BloodChainService = require('../services/web3/web3BloodChainService');

module.exports = async () => {
  try {
    const info = await web3BloodChainService.getInfo();
    if (info) {
      winston.info(`Connect to ${info} successfully`);
    } else {
      throw new Error();
    }
  } catch (error) {
    winston.error('Cannot connect to Ethereum blockchain', error);
  }
};
