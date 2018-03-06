'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const SUBJECT = 'Taipei Ethereum Meetup - ticket information';

exports.sendRegisterEmail = functions.database.ref('/users/{wallet}').onCreate((event) => {
  const user = event.data.val();
  user.wallet = event.params.wallet;

  return sendRegisterEmail(user);
});

function sendRegisterEmail (user) {
  const mailOptions = {
    from: `${APP_NAME} <eth.taipei@gmail.com>`,
    to: user.email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = SUBJECT;
  mailOptions.text = `Hi ${user.name}\n\n, Thank you for registration, ` +
    `please show this email when you arrive venue to our staff.\n\n` +
    `Wallet: ${user.wallet}\nName: ${user.name}\nEmail: ${user.email}\nTransaction: ${user.transaction}\n`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('registration email sent to:', email);
  });
}
