const web3 = require('../../web3');
const Web3Utils = require('../../utils/Web3Utils');
const bloodPackArtifacts = require('../../contracts/BloodPack.json');

exports.getContract = (contractAddress) => {
  return new web3.eth.Contract(
    bloodPackArtifacts.abi,
    contractAddress
  );
};

exports.getAccounts = async () => {
  return await web3.eth.getAccounts();
};

exports.transfer = async (contractAddress, fromId, fromName, toId, toName, description) => {
  const accounts = await this.getAccounts();
  const BloodPack = this.getContract(contractAddress);

  return new Promise((resolve, reject) => {
    return BloodPack.methods
      .transfer(fromId, fromName, toId, toName, description)
      .send({ from: accounts[0] })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
};

exports.getHistoriesLength = async (contractAddress) => {
  const BloodPack = this.getContract(contractAddress);
  return await BloodPack.methods
    .getHistoriesLength()
    .call();
};

exports.getHistory = async (contractAddress, index) => {
  const BloodPack = this.getContract(contractAddress);
  return await BloodPack.methods
    .getHistory(index)
    .call();
};
