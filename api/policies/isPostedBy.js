module.exports = function(req, res, next) {
  Entry.findOne({ id: req.params.id })
  .populate('postedBy')
  .exec( function (err, doc) {
    if(err) return next(err);
    if(!req.user) return res.redirect('/');
    if (req.user.username == doc.postedBy.name) {
      return next();
    }
    return res.redirect('/');
  });
};