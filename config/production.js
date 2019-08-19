module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
  token: {
    expirationTime: parseInt(process.env.TOKEN_EXPIRATION_TIME)
  },
  corsWhitelist: process.env.CORS_WHITELIST.split(' '),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  sendGrid: {
    email: process.env.SENDGRID_EMAIL,
    apiKey: process.env.SENDGRID_API_KEY,
  },
  mnemonic: process.env.MNEMONIC,
  infuraEndpoint: process.env.INFURA_ENDPOINT,
  contractAddress: {
    BloodChain: process.env.CONTRACT_ADDRESS_BLOODCHAIN
  },
  point: {
    bloodPackPoint: parseInt(process.env.BLOOD_PACK_POINT),
    goldPlanPoint: parseInt(process.env.GOLD_PLAN_POINT),
    silverPlanPoint: parseInt(process.env.SILVER_PLAN_POINT),
    bronzePlanPoint: parseInt(process.env.BRONZE_PLAN_POINT)
  },
  ethAmount: {
    goldPlan: parseFloat(process.env.GOLD_PLAN_ETH_AMOUNT),
    silverPlan: parseFloat(process.env.SILVER_PLAN_ETH_AMOUNT),
    bronzePlan: parseFloat(process.env.BRONZE_PLAN_ETH_AMOUNT)
  }
};
