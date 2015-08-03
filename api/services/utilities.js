var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gravyisthesauce@gmail.com',
    pass: 'GRAVYpass2015'
  }
});

module.exports = {
  isToday: function (date) {
    var now = new Date();
    var dateSplit = date.toString().split(" ");
    if(dateSplit[3] == now.getFullYear()) {
      if(this.getMonthInt(dateSplit[1]) == now.getMonth()) {
        if(dateSplit[2] == now.getDate()) {
          return true;
        }
      }
    }
    return false;
  },

  sendMail: function (to, subject, body) {
    var text = body;
    var html = body;
    var mailOptions = {
      from: '♨ The Sauce<gravyisthesauce@gmail.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plaintext body
      html: html // html body
    }

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent to ' + to, info.response);
      return { message: "Success!" };
    });
  },

  mail: {
    welcome: function (username, id) {
      return "Welcome to the sauce, "+username+"! Click this link to verify your account: <a href='http://gravy.io/verify/"+id+"'>Verify me</a>!"
    }
  },

  timeSince: function (date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 3600);
    return interval;
  },

  popularity: function (date, score) {
    var s  = (score/(this.timeSince(date)+1)).toFixed(2);
    return s;
  },

  addPopScore: function (data) {
    for (i = 0; i < data.length; i++) {
      data[i].pop = this.popularity(new Date(data[i].createdAt),(data[i].ups - data[i].downs));
    }
    return data;
  },

  sortByScore: function (data) {
    var i,m,j;
    for (i = -1; ++i < data.length;) {
      for (m = j = i; ++j < data.length;) {
        mScore = data[m].ups - data[m].downs;
        jScore = data[j].ups - data[j].downs;
        if (mScore < jScore) m = j;
        if (mScore == jScore && data[m].createdAt < data[j].createdAt) m = j;
      }
      t1 = data[m];
      t2 = data[i];
      data[m] = t2;
      data[i] = t1;
    }
    return data;
  },

  sortByPop: function (data) {
    var i,m,j;
    data = this.addPopScore(data);
    for (i = -1; ++i < data.length;) {
      for (m = j = i; ++j < data.length;) {
        mScore = data[m].pop;
        jScore = data[j].pop;
        if (mScore < jScore) m = j;
        if (mScore == jScore) m = j;
      }
      t1 = data[m];
      t2 = data[i];
      data[m] = t2;
      data[i] = t1;
    }
    for (i = 0; i < data.length; i++){ data[i].pop = null; };
      return data;
  },

  getMonthInt: function (month) {
    var monthInt;
    switch(month) {
      case 'Jan':
      monthInt = 0
      break;
      case 'Feb':
      monthInt = 1
      break;
      case 'Mar':
      monthInt = 2
      break;
      case 'Apr':
      monthInt = 3
      break;
      case 'May':
      monthInt = 4
      break;
      case 'Jun':
      monthInt = 5
      break;
      case 'Jul':
      monthInt = 6
      break;
      case 'Aug':
      monthInt = 7
      break;
      case 'Sep':
      monthInt = 8
      break;
      case 'Oct':
      monthInt = 9
      break;
      case 'Nov':
      monthInt = 10
      break;
      case 'Dec':
      monthInt = 11
      break;
    }
    return monthInt;

  }
}