module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage');
    } else {
      return res.view('homepage', { user: req.user });
    }
  },

  userlist: function (req, res) {
    User.find().exec( function (err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('userlist', { user: req.user, data: data })
    });
  },

  sublist: function (req, res) {
    Sub.find().exec( function (err, data) {
      if (err) return next(err);
      if (!req.user) {
        return res.redirect("/");
      }
      return res.view('sublist', { user: req.user, data: data })
    });
  },

  listing: function (req, res) {

    var listingData = {};
    var sub = req.params.sub || false;

    function listingView() {
      return res.view('listing', { user: req.user, data: listingData })
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
        Comment.find({id: _.pluck(results.entry.comments, 'id')})
        .populate('children')
        .populate('parent')
        .exec(foo);
      }],
      map: ['comments', function (foo, results) {
        var comments = _.indexBy(results.comments, 'id');
        var entry = results.entry.toObject();

        entry.comments = entry.comments.map( function (comment) {
          comment = comments[comment.id];
          return comment;
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
      delete(results.map.comments);
      data.entries = [results.map];
      data.entries[0].comments = hold;
      return res.view('entry', { user: req.user, data: data });
    });
}
};
