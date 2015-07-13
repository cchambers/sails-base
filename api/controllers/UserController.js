module.exports = {

  make: function (req, res) {
    User.register(new User({ email : req.body.email }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { account : account, user: false });
      } else {
        return res.render('homepage', {user: false });
      }

      passport.authenticate('local')(req, res, function () {
        if (user) {
          return res.view('homepage', { user: false });
        } else {
          return res.view('homepage', { user: req.user });
        }
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

  myProfile: function (req, res) {
    User.find({ username: req.user.username }, function (err, data) {
      if (err) return next(err);
      return res.view('my-profile', { user: req.user, data: data });
    });
  },

  userProfile: function (req, res) {
    User.find({ username: req.user.username }, function (err, data) {
      if (err) return next(err);
      return res.view('user-profile', { user: req.user, data: data });
    });
  }
};

