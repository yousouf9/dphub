const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const config = require('config');
const smtpTransport = require('nodemailer-smtp-transport');




const hostConfig={
    service: 'gmail',
   host: config.get("mail.mailHost"),
  // port: config.get("mail.mailPort"),
    auth: {
        user: config.get("mail.mailUsername"),
        pass: config.get("mail.mailPassword")
    }
}

const sendMail = (from, to, subject, html, callback)=>{


    var transporter = nodemailer.createTransport(smtpTransport(hostConfig));

    transporter.use('compile', htmlToText());


    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
      };
      
     return transporter.sendMail(mailOptions, callback);

    }

    module.exports.sendMail = sendMail;