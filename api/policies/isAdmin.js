module.exports = function(req, res, next) {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  return res.redirect('/');
};
