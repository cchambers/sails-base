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

  Entry.find({ nsfw: { $ne: true } })
  .populate('comments')
  .populate('postedTo')
  .populate('postedBy')
  .populate('subs')
      //.populate('votes', { user: req.user.id })
      .exec( function (err, data) {
        for (var x = 0; x < data.length; x++) {
          if (data[x].media) { 
            if ( data[x].media.indexOf('.jpg') > 0 || data[x].media.indexOf('.jpeg') > 0 || data[x].media.indexOf('.gif') > 0  || data[x].media.indexOf('.png') > 0 ) {
              viewdata.images.push(data[x]);
            } else if ( data[x].media.indexOf('youtube') > 0 || data[x].media.indexOf('youtu.be') > 0 || data[x].media.indexOf('liveleak') > 0) {
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
        viewdata.text = utilities.sortByPopularity(viewdata.text);
        getEntries();
      });

      function getEntries() {
        var loggedin = (req.user == undefined) ? false : true;

        var query = { nsfw: { $ne: true } };
        if (req.user) {
          // if user doesn't mind NSFW stuff...
          query = {};
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

    // Entry.find({ nsfw: { $ne: true } })
    // .populate('comments')
    // .populate('postedTo')
    // .populate('postedBy')
    // .populate('subs')
    // //.populate('votes', { user: req.user.id })
    // .exec( function (err, data) {
    //   for (var x = 0; x < data.length; x++) {
    //     if (data[x].media) { 
    //       if ( data[x].media.indexOf('.jpg') > 0 || data[x].media.indexOf('.jpeg') > 0 || data[x].media.indexOf('.gif') > 0  || data[x].media.indexOf('.png') > 0 ) {
    //         viewdata.images.push(data[x]);
    //       } else if ( data[x].media.indexOf('youtube') > 0 || data[x].media.indexOf('youtu.be') > 0 || data[x].media.indexOf('liveleak') > 0) {
    //         viewdata.videos.push(data[x]);
    //       } else {
    //         viewdata.text.push(data[x]);
    //       }
    //     } else {
    //       viewdata.text.push(data[x]);
    //     }
    //   }
    //   viewdata.images = utilities.sortByPopularity(viewdata.images);
    //   viewdata.videos = utilities.sortByPopularity(viewdata.videos);
    //   viewdata.text = utilities.sortByPopularity(viewdata.text);
    //   getEntries();
    // });

    // function getEntries() {
    //   var loggedin = (req.user == undefined) ? false : true;

    //   var query = { nsfw: { $ne: true } };
    //   if (req.user) {
    //     // if user doesn't mind NSFW stuff...
    //     query = {};
    //     var userid = req.user.id || "none";
    //   }
    //   Entry.find(query)
    //   .populate('comments')
    //   .populate('postedTo')
    //   .populate('postedBy')
    //   .populate('subs')
    //   .populate('votes', { user: userid })
    //   .exec( function (err, data) {
    //     if (data) {
    //       if (err) return next(err);
    //       data = utilities.sortByPopularity(data);
    //       viewdata.entries = data;
    //       loadView()
    //     }
    //   });
    // }

    function loadView() {
      return res.view('front-page', { user: req.user, data: viewdata  })
    }
  }
};
