module.exports = function(req, res, next) {
  if (req.user){
    if (req.user.verified) {
      return next();
    }
  }
  return res.redirect('/');
};
