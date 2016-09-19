var Utilities = require('../services/Utilities');

module.exports = {
  create: function (req, res) {
    Name.findOne({ name: req.body.username })
    .exec( function (err, doc) {
      if (doc) {
        return res.json({ message: "Username exists." })
      }
      User.create(req.body)
      .exec( function (err, doc) {
        if (doc) {
          var user = doc.id;
          Name.create({
            name: req.body.username,
            user: user
          }).exec( function (err, doc) {
            Utilities.sendMail(req.body.email, "Welcome to the sauce!", Utilities.mail.welcome(req.body.username, user));
            return res.json({ message: "Welcome to the sauce!", callback: "signUp" })
          });
        } else {
          return res.json({ message: "Email exists." })
        }
      });
    })
  },

  getVerified: function (req, res) {
    return res.view('message', { 
      message: "Click here to resend your verification email.", 
      type: "alert",
      data: false,
    });
  },

  verify: function (req, res) {
    User.findOne(req.params.id)
    .exec( function (err, doc) {
      doc.verified = true;
      doc.save();
      return res.view('message', { 
        message: "Account verified! Please log in to continue.", 
        type: "success",
        data: false,
      });
    });
  },

  makeAdmin: function (req, res) {
    User.findOne({ email: req.user.email }, function (err, doc) {
      doc.admin = true;
      doc.save();
      return res.redirect("/userlist");
    });
  },

  offline: function (req, res) {
    User.find()
    .exec( function (err, data) {
      for (var x = 0; x < data.length; x++) {
        User.findOne(data[x].id)
        .exec( function (err, doc) {
          doc.online = false;
          doc.save();
        });
      }
      return res.json({ message: "Success?" })
    });
  },

  myProfile: function (req, res) {
    User.findOne(req.user.id) 
    .populate('names')
    .exec( function (err, data) {
      if (err) return next(err);
      return res.view('my-profile', { user: req.user, data: data });
    });
  },

  userProfile: function (req, res) {
    User.find({ username: req.user.username })
    .then( function (data) {
      return res.view('user-profile', { user: req.user, data: data });
    });
  },
  
  list: function (req, res) {
    User.find()
    .sort('online desc')
    .exec( function (err, data) {
      if (err) return next(err);
      return res.view('userlist', { user: req.user, data: data })
    });
  }
}

