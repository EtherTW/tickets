const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const production = functions.config().general.production === '1';
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
const ETHERSCAN_BASE = production ? 'https://etherscan.io/tx' : 'https://ropsten.etherscan.io/tx';

exports.sendRegisterEmail = functions.database.ref('/users/{uid}').onCreate((event) => {
  const user = event.data.val();
  return sendRegisterEmail(user);
});

function sendRegisterEmail (user) {
  const mailOptions = {
    from: `Taipei Ethereum Meetup <eth.taipei@gmail.com>`,
    to: user.email,
  };

  mailOptions.subject = SUBJECT;
  mailOptions.text = `Hi ${user.name},\n\n` +
    `Thank you to register this event, ` +
    `please take a look on your transaction url, you get ticket only when transaction is successful. when you arrive venue please show this email to our staff.\n\n` +
    `* Name: ${user.name}\n` +
    `* Email: ${user.email}\n` +
    `* Wallet: ${user.wallet}\n` +
    `* Transaction URL: ${ETHERSCAN_BASE + '/' + user.transaction}\n\n` +
    `- Taipei Ethereum Meetup`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('registration email sent to:', user.email);
  });
}
