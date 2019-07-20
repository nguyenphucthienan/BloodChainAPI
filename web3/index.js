const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const config = require('../config');

const web3 = new Web3(new HDWalletProvider(config.mnemonic, config.infuraEndpoint));
module.exports = web3;
