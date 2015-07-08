var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      req.logIn(user, function(err) {
        if (err) res.send(err);
        //console.log(req.headers);
        return res.redirect(req.headers.referer);
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};
