var nodemailer = require('nodemailer');

var config = require('../../config');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.alertEmail, pass: config.alertPassword },
    
});

exports.emailUser = async function (userEmail, subject, text, callback) {
    var mailOptions = {from: config.alertEmail, to: userEmail, subject: subject, text: text};
    //transporter.sendMail(mailOptions, callback);

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

exports.emailUserHtml = function (userEmail, subject, html, callback) {
  var mailOptions = {from: config.alertEmail, to: userEmail, subject: subject, html: html};
  //transporter.sendMail(mailOptions, callback);

  transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
}