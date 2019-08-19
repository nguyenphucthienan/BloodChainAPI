const sgMail = require('@sendgrid/mail');
const config = require('../config');

function getSenderInfo() {
  return {
    name: 'BloodChain',
    email: config.sendGrid.email
  };
}

function getDonateMailTemplate(
  donorFistName, donorLastName,
  donateTime, bloodPackId
) {
  return `
    Hi ${donorFistName} ${donorLastName},
    <br>
    <br>
    Thank you so much for the donation on <strong>${donateTime.toDateString()}</strong>.
    With your blood donation, you have done a great service to the nation.
    <br>
    <br>
    Your blood pack ID is: <strong>${bloodPackId}</strong>.
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

function getTransferBloodPackMailTemplate(
  donorFistName, donorLastName,
  fromOrganizationName, toOrganizationName,
  transferTime, bloodPackId
) {
  return `
    Hi ${donorFistName} ${donorLastName},
    <br>
    <br>
    Your blood pack (ID: <strong>${bloodPackId}</strong>) has been transfered 
    from <strong>${fromOrganizationName}</strong> to <strong>${toOrganizationName}</strong>
    on <strong>${transferTime.toDateString()}</strong>.
    <br>
    <br>
    Your blood is on its way to help someone in need. You are someone's hero.
    <br>
    <br>
    Thank you for helping save lifes.
    <br>
    <br>
    With gratitude,
    <br>
    <br>
    BloodChain Team
  `;
}

function getTransferBloodProductMailTemplate(
  donorFistName, donorLastName,
  fromOrganizationName, toOrganizationName,
  transferTime, bloodProductId
) {
  return `
    Hi ${donorFistName} ${donorLastName},
    <br>
    <br>
    One of your blood products (ID: <strong>${bloodProductId}</strong>) has been transfered 
    from <strong>${fromOrganizationName}</strong> to <strong>${toOrganizationName}</strong>
    on <strong>${transferTime.toDateString()}</strong>.
    <br>
    <br>
    Your blood is on its way to help someone in need. You are someone's hero.
    <br>
    <br>
    Thank you for helping save lifes.
    <br>
    <br>
    With gratitude,
    <br>
    <br>
    BloodChain Team
  `;
}

function getUseBloodProductMailTemplate(
  donorFistName, donorLastName,
  hospitalName, patientName,
  useTime, bloodProductId
) {
  return `
    Hi ${donorFistName} ${donorLastName},
    <br>
    <br>
    One of your blood products (ID: <strong>${bloodProductId}</strong>) has been used 
    to save <strong>${patientName}</strong>'s life at <strong>${hospitalName}</strong>
    on <strong>${useTime.toDateString()}</strong>.
    <br>
    <br>
    Thanks for giving someone you do not even know that opportunity.
    <br>
    <br>
    Life is a gift. Give more of it. Keep on donating and believing in life. 
    <br>
    <br>
    With gratitude,
    <br>
    <br>
    BloodChain Team
  `;
}

exports.sendDonateMail = (
  donorEmail, donorFistName, donorLastName,
  donateTime, bloodPackId
) => {
  const message = {
    from: getSenderInfo(),
    to: donorEmail,
    subject: 'BloodChain: Thank you for your blood donation',
    html: getDonateMailTemplate(
      donorFistName, donorLastName,
      donateTime, bloodPackId
    ),
  };

  sgMail.send(message);
};

exports.sendTransferBloodPackMail = (
  donorEmail, donorFistName, donorLastName,
  fromOrganizationName, toOrganizationName,
  transferTime, bloodPackId
) => {
  const message = {
    from: getSenderInfo(),
    to: donorEmail,
    subject: 'BloodChain: Your blood has been transfered',
    html: getTransferBloodPackMailTemplate(
      donorFistName, donorLastName,
      fromOrganizationName, toOrganizationName,
      transferTime, bloodPackId
    ),
  };

  sgMail.send(message);
};

exports.sendTransferBloodProductMail = (
  donorEmail, donorFistName, donorLastName,
  fromOrganizationName, toOrganizationName,
  transferTime, bloodProductId
) => {
  const message = {
    from: getSenderInfo(),
    to: donorEmail,
    subject: 'BloodChain: Your blood has been transfered',
    html: getTransferBloodProductMailTemplate(
      donorFistName, donorLastName,
      fromOrganizationName, toOrganizationName,
      transferTime, bloodProductId
    ),
  };

  sgMail.send(message);
};

exports.sendUseBloodProductMail = (
  donorEmail, donorFistName, donorLastName,
  hospitalName, patientName,
  useTime, bloodProductId
) => {
  const message = {
    from: getSenderInfo(),
    to: donorEmail,
    subject: 'BloodChain: Your blood has been used',
    html: getUseBloodProductMailTemplate(
      donorFistName, donorLastName,
      hospitalName, patientName,
      useTime, bloodProductId
    ),
  };

  sgMail.send(message);
};
