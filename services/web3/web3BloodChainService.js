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

exports.getAccounts = async () => {
  return await web3.eth.getAccounts();
};

exports.getBalance = async (address) => {
  return await web3.eth.getBalance(address);
};

exports.getInfo = async () => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getInfo()
    .call();
};

exports.fund = async (amount) => {
  const accounts = await this.getAccounts();
  const hexAmount = Web3Utils.toHex(amount);
  return new Promise((resolve, reject) => {
    return BloodChain.methods
      .fund()
      .send({ from: accounts[0], value: hexAmount })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
}

exports.transfer = async (address, amount) => {
  const accounts = await this.getAccounts();
  const BloodChain = this.getContract();
  const hexAmount = Web3Utils.toHex(amount);
  return new Promise((resolve, reject) => {
    return BloodChain.methods
      .transfer(address, hexAmount)
      .send({ from: accounts[0] })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
}

exports.getUserInfo = async (userId) => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getUserInfo(userId)
    .call();
};

exports.getUserInfoAddress = async (userId) => {
  const BloodChain = this.getContract();
  return await BloodChain.methods
    .getUserInfoAddress(userId)
    .call();
}

exports.createUserInfo = async (userId) => {
  const accounts = await this.getAccounts();
  const BloodChain = this.getContract();
  return new Promise((resolve, reject) => {
    return BloodChain.methods
      .createUserInfo(userId)
      .send({ from: accounts[0] })
      .on('transactionHash', async hash => {
        await Web3Utils.getTransactionReceipt(hash);
        resolve(hash);
      })
      .on('error', error => reject(error));
  });
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
