const config = require('../config');
const web3BloodChainService = require('../services/web3/web3BloodChainService');

exports.getInfo = async (req, res) => {
  const address = config.contractAddress.BloodChain;
  const balance = await web3BloodChainService.getBalance(address);
  return res.send({ address, balance });
};

exports.getBalance = async (req, res) => {
  const { address } = req.query;
  const balance = await web3BloodChainService.getBalance(address);
  return res.send({ address, balance });
};

exports.fund = async (req, res) => {
  const amount = req.body;
  const transactionId = await web3BloodChainService.fund(amount);
  return res.send({ transactionId });
};

exports.transfer = async (req, res) => {
  const { address, amount } = req.body;
  const transactionId = await web3BloodChainService.transfer(address, amount);
  return res.send({ transactionId });
};
