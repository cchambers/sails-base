module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      Comment.findOne({id: req.query.parent}).exec(function(err,data){
        return res.view('new-comment', { user: req.user, data: false, parent: data, slug: req.query.slug});
      })
    }
  },
  reply: function(req, res){
    console.log("maybe?");
    console.log(req.body);
    console.log(req.params);
    Comment.findOne({id: req.params.id})
    .exec(function(err, data){
      Comment.create({
        parent: data.id,
        content: req.body.message,
        postedBy: req.user.username
      }).exec(function(err, comment){
        return;
      })
    });
  }
};
