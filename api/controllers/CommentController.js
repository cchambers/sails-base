module.exports = {
  create: function (req, res) {
    console.log(req.body)
    var commentData = {
      entry: "",
      parent: null,
      content: req.body.message,
      postedBy: ""
    }

    
    // TODO: Check updatedAt date of user's last post (if any)
    // and make sure it's at least 2 minutes ago

    var viewdata = {
      name: req.user.username,
      content: req.body.message
    }

    Name.findOne({ name: req.user.username })
    .exec( function (err, name) {
      if (err) return next(err);
      commentData.postedBy = name.id;

      Entry.findOne(req.body.entryid)
      .exec( function (err, entry) {
        if (err) return next(err);
        commentData.entry = entry.id;

        if (!entry.commentCount) {
          entry.commentCount = 0;
        }
        entry.commentCount = entry.commentCount + 1;
        entry.save();
        if (req.body.parent) {
          replyToParent();
        } else {
          createComment();
        }
      });
    })

    function createComment() {
      Comment.create(commentData)
      .exec( function (err, comment) {
        if (err) return res.json({ message: "ERROR!", data: err });;
        return res.json({ message: "Success!", data: viewdata });
      });
    }

    function replyToParent() {
      Comment.findOne(req.body.parent)
      .exec( function (err, comment) {
        if (err) return next(err);
        commentData.parent = comment.id;
        createComment();
      })
    }
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
