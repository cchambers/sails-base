module.exports = function(req, res, next) {
  if (req.user) {
    if (req.user.admin) {
      return next();
    } else {
      return res.json({ message: "No." });
    }
  } else {
    return res.json({ message: "No." });
  }
};
