var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gravyisthesauce@gmail.com',
    pass: 'GRAVYpass2015'
  }
});



module.exports = {
  send: function(req, res) {
    var to = req.params.to;
    var mailOptions = {
        from: '♨ The Sauce<gravyisthesauce@gmail.com>', // sender address
        to: to, // list of receivers
        subject: 'Welcome to the sauce!', // Subject line
        text: 'Blah blah blah!', // plaintext body
        html: '<b>Hello world</b>' // html body
      }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
};