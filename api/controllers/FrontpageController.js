module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  userlist: function (req, res) {
    User.find().exec( function (err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('userlist', { user: req.user, data: data })
    });
  },

  sublist: function (req, res) {
    Sub.find().exec( function (err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('sublist', { user: req.user, data: data })
    });
  }
};
