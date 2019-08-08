const Web3Utils = require('./Web3Utils');

class BloodChainUtils {
  static extractTransferHistoryInfo(data) {
    const transferType = data[0];
    const id = data[1];

    const from = data[2];
    const fromData = from.split('|;|');
    const fromType = fromData[0];
    const fromId = fromData[1];
    const fromName = fromData[2];

    const to = data[3];
    const toData = to.split('|;|');
    const toType = toData[0];
    const toId = toData[1];
    const toName = toData[2];

    const description = data[4];
    const transferedAt = Web3Utils.fromHexToDate(data[5]);

    return {
      transferType, id,
      fromType, fromId, fromName,
      toType, toId, toName,
      description, transferedAt
    };
  }

  static extractUserInfo(data) {
    const id = data[0];
    const createdAt = Web3Utils.fromHexToDate(data[1]);
    const point = Web3Utils.fromHexToNumber(data[2]);

    return {
      id,
      createdAt,
      point
    };
  }

  static extractPointHistoryInfo(data) {
    const updatePointType = data[0];
    const amount = Web3Utils.fromHexToNumber(data[1]);
    const description = data[2];
    const updatedAt = Web3Utils.fromHexToDate(data[3]);

    return {
      updatePointType,
      amount,
      description,
      updatedAt
    };
  }
}

module.exports = BloodChainUtils;
