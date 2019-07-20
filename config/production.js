module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
  token: {
    expirationTime: parseInt(process.env.TOKEN_EXPIRATION_TIME)
  },
  corsWhitelist: process.env.CORS_WHITELIST.split(' '),
  mnemonic: process.env.MNEMONIC,
  infuraEndpoint: process.env.INFURA_ENDPOINT,
  contractAddress: {
    BloodChain: process.env.CONTRACT_ADDRESS_BLOODCHAIN
  }
};
