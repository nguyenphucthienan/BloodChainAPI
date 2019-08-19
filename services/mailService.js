const sgMail = require('@sendgrid/mail');
const config = require('../config');

function getDonateMailTemplate(donorFistName, donorLastName, donateTime, bloodPackId) {
  return `
    Hi ${donorFistName} ${donorLastName},
    <br>
    <br>
    Thank you so much for your donation on <strong>${donateTime.toDateString()}</strong>
    <br>
    <br>
    Your blood pack ID is: <strong>${bloodPackId}</strong>
    <br>
    <br>
    Your support is so important in helping us to save and improve lives.
    <br>
    <br>
    Once again, thank you for your compassion and support.
    <br>
    <br>
    With gratitude,
    <br>
    <br>
    BloodChain Team
  `;
}

exports.sendDonateMail = (donorEmail, donorFistName, donorLastName, donateTime, bloodPackId) => {
  const message = {
    from: config.sendGrid.email,
    to: donorEmail,
    subject: 'BloodChain: Thank you for helping save lives',
    html: getDonateMailTemplate(donorFistName, donorLastName, donateTime, bloodPackId),
  };

  sgMail.send(message);
};
