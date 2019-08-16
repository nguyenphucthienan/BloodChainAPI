const config = require('../config');
const web3BloodChainService = require('../services/web3/web3BloodChainService');

exports.getInfo = async (req, res) => {
  const address = config.contractAddress.BloodChain;
  const balance = await web3BloodChainService.getBalance(address);
  return res.send({ address, balance });
};
