const web3 = require('../../web3');
const config = require('../../config');
const Web3Utils = require('../../utils/Web3Utils');
const bloodChainArtifacts = require('../../contracts/BloodChain.json');

let BloodChain;

exports.getContract = () => {
  if (BloodChain) {
    return BloodChain;
  }

  BloodChain = new web3.eth.Contract(
    bloodChainArtifacts.abi,
    config.contractAddress.BloodChain
  );

  return BloodChain;
};

exports.getInfo = async () => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getInfo()
    .call();
};

exports.getAccounts = async () => {
  return await web3.eth.getAccounts();
};

exports.getBloodPack = async (bloodPackId) => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getBloodPack(bloodPackId)
    .call();
};

exports.getBloodPackAddress = async (bloodPackId) => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getBloodPackAddress(bloodPackId)
    .call();
}

exports.createBloodPack = async (bloodPackId) => {
  const accounts = await this.getAccounts();
  const BloodChain = this.getContract();

  return new Promise((resolve, reject) => {
    return BloodChain.methods
      .createBloodPack(bloodPackId)
      .send({ from: accounts[0] })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
};
