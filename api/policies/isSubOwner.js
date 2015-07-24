module.exports = function(req, res, next) {
  var subOwner = 'unidentified';
  Sub.findOne({ name: req.params.sub })
  .populate('creator')
  .exec( function (err, doc) {
    console.log(doc);
    if(err) return next(err);
    subOwner = doc.creator.name;
    if(!req.user) return res.redirect('/');
    if (req.user.username == subOwner) {
      return next();
    }
    return res.redirect('/');
  });
};
