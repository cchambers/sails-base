var utilities = require('../services/utilities');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    var viewdata = {
      images: [],
      text: [],
      links: [],
      videos: [],
      entries: []
    }

    Entry.find({ where: { nsfw: false }, limit: 50, skip: 0, sort: 'createdAt DESC' })
    .limit(100)
    .populate('comments')
    .populate('postedTo')
    .populate('postedBy')
    .populate('subs')
    .exec( function (err, data) {
      for (var x = 0; x < data.length; x++) {
        if (data[x].media) { 
          if ( data[x].media.indexOf('.jpg') > 0 || data[x].media.indexOf('.jpeg') > 0 || data[x].media.indexOf('.gif') > 0 || data[x].media.indexOf('.png') > 0 ) {
            if (data[x].media.indexOf('.gifv') < 0) {
              viewdata.images.push(data[x]);
            }
          } else if ( data[x].media.indexOf('youtu') > 0 || data[x].media.indexOf('liveleak') > 0 ) {
            viewdata.videos.push(data[x]);
          } else {
            viewdata.text.push(data[x]);
          }
        } else {
          viewdata.text.push(data[x]);
        }
      }
      viewdata.images = utilities.sortByPopularity(viewdata.images);
      viewdata.videos = utilities.sortByPopularity(viewdata.videos);
      viewdata.text = data;
      getEntries();
    });

    function getEntries() {
      var loggedin = (req.user == undefined) ? false : true;
      
      var query = { where: { nsfw: false }, limit: 50, skip: 0, sort: 'createdAt DESC' };
      if (req.user) {
        query = { limit: 50, skip: 0, sort: 'createdAt DESC' };
        var userid = req.user.id || "none";
      }
      Entry.find(query)
      .populate('comments')
      .populate('postedTo')
      .populate('postedBy')
      .populate('subs')
      .populate('votes', { user: userid })
      .exec( function (err, data) {
        if (data) {
          if (err) return next(err);
          data = utilities.sortByPopularity(data);
          viewdata.entries = data;
          loadView()
        }
      });
    }

    function loadView() {
      return res.view('front-page', { user: req.user, data: viewdata  })
    }
  },

  entriesFrom: function (req, res) {
    var sub = req.params.slug || null;
    var viewdata = {
      entries: []
    }
    var from = req.params.from || 0;
    if (sub) {
      getSub();
    } else {
      getEntries();
    }

    function getSub() {
      Sub.findOne({ slug: sub })
      .exec( function (err, subdoc) {
        if (err) return next(err);
        if (subdoc.id) {
          sub = subdoc.id;
        }
        getEntries();
      })
    }

    function getEntries() {
      var loggedin = (req.user == undefined) ? false : true;
      var limit = 50;
      var query = (sub) ? { where: { subs: sub }, limit: limit, skip: from, sort: 'createdAt DESC'  } : { limit: limit, skip: from, sort: 'createdAt DESC'  }; 
      Entry.find(query)
      .populate('comments')
      .populate('postedTo')
      .populate('postedBy')
      .populate('subs')
      .populate('votes')
      .exec( function (err, data) {
        if (data) {
          if (err) return next(err);
          data = utilities.sortByPopularity(data);
          viewdata.entries = data;
          return res.json(viewdata);
        }
      });
    }

  },

  test: function () {
    return res.json({ message: "What in the fuck" })
  },

  sub: function (req, res) {
    var viewdata = {
      images: [],
      text: [],
      links: [],
      videos: [],
      entries: []
    }
    var userid = (req.user) ? req.user.id : "none";
    var slug = req.params.sub;
    Sub.findOne({ slug: slug })
    .populate('creator')
    .exec( function (err, doc) {
      if (err) return next(err);
      if (doc) {
        viewdata.sub = doc;
        Entry.find({ subs: doc.id })
        .sort({ createdAt: 'desc' })
        .populate('comments')
        .populate('postedTo')
        .populate('postedBy')
        .populate('subs')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          viewdata.entries = data;
          loadView();
        });
      } else {
        return res.redirect("/new/sub?name="+req.params.sub)
      }
    });

    function loadView() {
      //return res.json({ user: req.user, data: viewdata  })
      return res.view('front-page', { user: req.user, data: viewdata  })
    }
  },

  single: function (req, res) {
    var viewdata = {
      images: [],
      text: [],
      links: [],
      videos: [],
      entries: [],
      single: {}
    }
    var userid = (req.user) ? req.user.id : "none";
    var sub = req.params.sub;
    Sub.findOne({ slug: sub })
    .populate('creator')
    .exec( function (err, doc) {
      if (err) return next(err);
      if (doc) {
        viewdata.sub = doc;
        Entry.find({ subs: doc.id })
        .sort({ createdAt: 'desc' })
        .populate('comments')
        .populate('postedTo')
        .populate('postedBy')
        .populate('subs')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          viewdata.entries = data;
          Entry.findOne({ slug: req.params.slug })
          .populate('postedTo')
          .populate('postedBy')
          .populate('subs')
          .populate('votes', { user: userid })
          .exec( function (err, single) {
            if (single) {
              viewdata.single = single;
              Comment.find({ entry: single.id })
              .populate('postedBy')
              .exec( function (err, comments) {
                viewdata.single.comments = comments;
                loadView();
              });
            } else {
              loadView();
            }
          })
        });
      } else {
        return res.redirect("/new/sub?name="+req.params.sub)
      }
    });

function loadView() {
      //return res.json({ user: req.user, data: viewdata  })
      return res.view('front-page', { user: req.user, data: viewdata  })
    }
  }
};
