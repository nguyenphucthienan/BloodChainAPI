const web3 = require('../web3');
const CommonUtils = require('./CommonUtils');

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
}

module.exports = Web3Utils;
