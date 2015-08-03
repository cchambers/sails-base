module.exports = function(req, res, next) {
  if (req.user){
    if (req.user.admin) {
      return next();
    }
  }
  return res.redirect('/');
};
