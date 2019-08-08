const Utils = require('web3-utils');
const CommonUtils = require('./CommonUtils');
const web3 = require('../web3');

class Web3Utils {
  static async getTransactionReceipt(hash) {
    let receipt = null;
    while (!receipt) {
      // We are going to check every second if transation is mined or not, once it is mined we'll leave the loop
      receipt = await Web3Utils.getTransactionReceiptPromise(hash);
      await CommonUtils.sleep(1000);
    }

    return receipt;
  }

  static getTransactionReceiptPromise(hash) {
    return new Promise(((resolve, reject) => {
      web3.eth.getTransactionReceipt(hash, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    }));
  }

  static fromWei(value, unit) {
    return Utils.fromWei(value, unit);
  }

  static toWei(value, unit) {
    return Utils.toWei(value, unit);
  }

  static toHex(value) {
    return Utils.toHex(value);
  }

  static fromHexToString(value) {
    return Utils.hexToString(value);
  }

  static fromHexToNumber(value) {
    return value.toNumber();
  }

  static fromHexToDate(hexTimestamp) {
    return new Date(hexTimestamp.toNumber());
  }
}

module.exports = Web3Utils;
