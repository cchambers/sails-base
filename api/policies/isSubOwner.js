module.exports = function(req, res, next) {
  Sub.findOne({ name: req.params.sub })
  .populate('creator')
  .exec( function (err, doc) {
    if(err) return next(err);
    if (req.user.username == doc.creator.name) {
      return next();
    }
    return res.redirect('/sub' + req.params.sub);
  });
};
