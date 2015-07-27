module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      Comment.findOne({id: req.query.parent})
      .populate('postedBy')
      .exec( function (err,data) {
        return res.view('new-comment', { user: req.user, data: false, parent: data, slug: req.query.slug});
      })
    }
  },

  create: function (req, res) {
    Name.findOne({ name: req.user.username })
    .exec( function (err, name) {
      Entry.findOne({slug: req.body.slug})
      .exec( function (err, entry) {
        if (!entry.commentCount) {
          entry.commentCount = 0;
        }
        entry.commentCount = entry.commentCount + 1;
        entry.save();
        Comment.create({
          entry: entry.id,
          content: req.body.message,
          postedBy: name.id
        }).exec( function (err, comment) {
          if (err) return next(err);
          return res.json({ message: "Success!", reload: true });
        });
      });
    })
    
  },

  reply: function (req, res) {
    Name.findOne({ name: req.user.username })
    .exec( function (err, name) {
      Entry.findOne({slug: req.body.slug})
      .exec( function (err, entry) {
        if (!entry.commentCount) {
          entry.commentCount = 0;
        }
        entry.commentCount = entry.commentCount + 1;
        entry.save();
        Comment.findOne({ id: req.params.id })
        .exec( function (err, comment) {
          Comment.create({
            parent: comment.id,
            entry: entry.id,
            content: req.body.message,
            postedBy: name.id
          }).exec( function (err, comment) {
            return res.json({ message: "Success!", reload: true });
          });
        })
      })
    })
  },

  children: function (req, res) {
    Comment.find({ parent: req.params.id })
    .populate('children')
    .populate('postedBy')
    .exec( function (err, data) {
      return res.json(data)
    });
  }
};
