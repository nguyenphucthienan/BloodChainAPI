const Web3Utils = require('./Web3Utils');

class BloodChainUtils {
  static extractHistoryInfo(data) {
    const from = data[0];
    const fromData = from.split('|;|');
    const fromType = fromData[0];
    const fromId = fromData[1];
    const fromName = fromData[2];

    const to = data[1];
    const toData = to.split('|;|');
    const toType = toData[0];
    const toId = toData[1];
    const toName = toData[2];

    const description = data[2];
    const transferedAt = Web3Utils.fromHexToDate(data[3]);

    return {
      fromType, fromId, fromName,
      toType, toId, toName,
      description, transferedAt
    };
  }
}

module.exports = BloodChainUtils;
