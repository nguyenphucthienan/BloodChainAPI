const sgMail = require('@sendgrid/mail');
const config = require('../config');

module.exports = () => {
  sgMail.setApiKey(config.sendGrid.apiKey);
};
