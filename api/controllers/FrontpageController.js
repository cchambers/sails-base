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
    User.find().exec(function(err, data) {
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
    data = null;
    if (req.params.sub) {
      Entry.find({ postedTo: req.params.sub })
      .sort({ createdAt: 'desc' })
      .populate('comments')
      .exec( function (err, data) {
        if (err) return next(err);
        return res.view('listing', { user: req.user, data: data })
        });
      Sub.findOne({ name: req.params.sub })
      .exec( function (err, subData) {
        if (err) return next(err);
        data.sub = subData;
      });
    } else {
      Entry.find({}).sort({createdAt: 'desc'})
      .populate('comments')
      .exec( function (err, data) {
        if (err) return next(err);
        return res.view('listing', { user: req.user, data: data })
      });
    }
  },

  single: function (req, res) {
    Entry.find({ slug: req.params.slug })
    .populate('comments')
    .exec(function(err, data) {
      if (err) return next(err);
      return res.view('entry', { user: req.user, data: data })
    });
  }
};
