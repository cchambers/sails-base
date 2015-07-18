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

    var listingData = {};
    var sub = req.params.sub || false;

    function listingView() {
      return res.view('listing', { user: req.user, data: listingData })
    }

    function getEntries() {
      if (sub) {
        Entry.find({ postedTo: sub })
        .sort({ createdAt: 'desc' })
        .populate('comments')
        .exec( function (err, data) {
          if (err) return next(err);
          listingData.entries = data;
          getSub();
        });
      } else {
        Entry.find({})
        .sort({createdAt: 'desc'})
        .populate('comments')
        .exec(function (err, data) {
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
    Entry.findOne({ slug: req.params.slug })
    .populate('comments')
    .exec(function(err, doc) {
      if (err) return next(err);
      var data = {};
      data.entries = [];
      data.entries.push(doc);
      console.log(doc);
      return res.view('entry', { user: req.user, data: data })
    });
  }
};
