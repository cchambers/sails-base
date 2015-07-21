module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-entry', { user: req.user, data: false });
    }
  },

  listing: function (req, res) {
    var listingData = {};
    var sub = req.params.sub || false;

    function listingView() {
      return res.view('entry', { user: req.user, data: listingData })
    }

    function getEntries() {
      if (req.user) {
        var userid = req.user.id || "none";
      }
      if (sub) {
        Entry.find({ postedTo: sub })
        .sort({ createdAt: 'desc' })
        .populate('comments')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          listingData.entries = data;
          getSub();
        });
      } else {
        Entry.find({})
        .sort({createdAt: 'desc'})
        .populate('comments')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          listingData.entries = data;
          listingView();
        });
      }
    }

    function getSub() {
      Sub.findOne({ name: sub })
      .exec( function (err, data) {
        if (err) return next(err);
        listingData.sub = data;
        listingView();
      });
    }

    getEntries();
  },

  single: function (req, res) {
    async.auto({
      entry: function (foo) {
        if (req.user) {
          var userid = req.user.id || "none";
          Entry.findOne({slug: req.params.slug})
          .populate('comments')
          .populate('votes', { user: userid })
          .exec(foo);
        } else {
          Entry.findOne({slug: req.params.slug})
          .populate('comments')
          .exec(foo);
        }
      },
      comments: ['entry', function (foo, results) {
        Comment.find({parent: {$eq: null}, id: _.pluck(results.entry.comments, 'id')})
        .populate('children')
        .populate('parent')
        .exec(foo);
      }],
      map: ['comments', function (foo, results) {
        var comments = _.indexBy(results.comments, 'id');
        // console.log(comments);
        var entry = results.entry.toObject();

        entry.comments = entry.comments.map( function (comment) {
          comment = comments[comment.id];
          return comment;
        });

        console.log(entry);


        entry.comments = _.filter(entry.comments, function(comment){
            return comment != null;
        });

        return foo(null, entry);
      }]
    },
    function finish(err, results) {
      if(err) {
        return res.serverError(err);
      }
      var data = {};
      var hold = results.map.comments;
      data.entries = [results.map];

      return res.view('entry', { user: req.user, data: data });
    });
},

addComment: function(req, res){
  if ( typeof(req.user) == 'undefined' ) {
    return res.redirect('/');
  } else {
    Entry.findOne({slug: req.body.slug})
    .exec( function (err, data) {
      Comment.create({
        entry: data.id,
        content: req.body.message,
        postedBy: req.user.username
      }).exec(function(err, comment){

        if(err) return next(err);

        Entry.findOne({ slug: req.body.slug })
        .populate('comments')
        .exec(function(err, doc) {
          return;

        });
      });

    });
    return res.redirect('/');
  }
}
};
