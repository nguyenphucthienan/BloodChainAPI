const web3 = require('../../web3');
const Web3Utils = require('../../utils/Web3Utils');
const userInfoArtifacts = require('../../contracts/UserInfo.json');

exports.getContract = (contractAddress) => {
  return new web3.eth.Contract(
    userInfoArtifacts.abi,
    contractAddress
  );
};

exports.getAccounts = async () => {
  return await web3.eth.getAccounts();
};

exports.addPoint = async (contractAddress, point, description) => {
  const accounts = await this.getAccounts();
  const UserInfo = this.getContract(contractAddress);
  return new Promise((resolve, reject) => {
    return UserInfo.methods
      .addPoint(point, description)
      .send({ from: accounts[0] })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
};

exports.getHistoriesLength = async (contractAddress) => {
  const UserInfo = this.getContract(contractAddress);
  return await UserInfo.methods
    .getHistoriesLength()
    .call();
};

exports.getHistory = async (contractAddress, index) => {
  const UserInfo = this.getContract(contractAddress);
  return await UserInfo.methods
    .getHistory(index)
    .call();
};
