module.exports = function(req, res, next) {
  var subOwner = 'unidentified';
  Sub.findOne({ name: req.params.sub })
    .exec( function (err, subdata) {
      if(err) return next(err);
      subOwner = subdata.creator;
      if(!req.user) return res.redirect('/');
      if (req.user.username == subOwner) {
        return next();
      }
      return res.redirect('/');
    });
};
