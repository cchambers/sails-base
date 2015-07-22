module.exports = function(req, res, next) {
  var postedBy = 'unidentified';
  Entry.findOne({ slug: req.params.entry })
    .exec( function (err, entryData) {
      if(err) return next(err);
      postedBy = entryData.postedBy;
      if(!req.user) return res.redirect('/');
      if (req.user.username == postedBy) {
        return next();
      }
      return res.redirect('/');
    });
};