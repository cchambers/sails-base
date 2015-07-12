module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage');
    } else {
      return res.view('homepage', { user: req.user });
    }
  },

  userlist: function (req, res) {
    User.find().exec(function(err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('userlist', { user: req.user, data: data })
    });
  },

  sublist: function (req, res) {
    Sub.find().exec(function(err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('sublist', { user: req.user, data: data })
    });
  }
};

