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
            return res.json({ message: "Welcome to the sauce!", callback: "signUp" })
          });
        } else {
          return res.json({ message: "Email exists." })
        }
      });
    })
    // check username existence
    // check email existence
    // create name
    // create user
  },

  verify: function (req, res) {
    User.findOne(req.params.id)
    .exec( function (err, doc) {
      doc.verified = true;
      doc.save();
      return res.view('message', { 
        message: "Username verified! Login to continue.", 
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

  myProfile: function (req, res) {
    if (req.user) {
      User.findOne(req.user.id) 
      .populate('votes') 
      .populate('names')
      .exec( function (err, data) {
        if (err) return next(err);
        return res.view('my-profile', { user: req.user, data: data });
      });
    } else {
      return res.redirect("/");
    }
  },

  userProfile: function (req, res) {
    User.find({ username: req.user.username })
    .populate('entries')
    .then( function (data) {
      return res.view('user-profile', { user: req.user, data: data });
    });
  }
};

