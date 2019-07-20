const web3 = require('../../web3');
const config = require('../../config');
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

exports.getInfo = () => {
  const BloodChain = this.getContract();
  return BloodChain.methods
    .getInfo()
    .call();
};
