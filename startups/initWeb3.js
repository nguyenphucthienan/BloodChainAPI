const winston = require('winston');
const bloodChainService = require('../services/web3/bloodChainService');

module.exports = async () => {
  try {
    const info = await bloodChainService.getInfo();
    if (info) {
      winston.info(`Connect to ${info} successfully`);
    } else {
      throw new Error();
    }
  } catch (err) {
    winston.error('Cannot connect to Ethereum blockchain');
  }
};
