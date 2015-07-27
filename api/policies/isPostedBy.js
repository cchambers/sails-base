module.exports = function(req, res, next) {
  Entry.findOne({ id: req.params.id })
  .exec( function (err, doc) {
    if(err) return next(err);
    if ( (req.user.id == doc.postedBy) || req.user.admin) {
      return next();
    }
    return res.json({ message: "Failure" });
  });
};