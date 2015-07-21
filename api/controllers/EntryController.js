module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-entry', { user: req.user, data: false });
    }
  },
  
  delete: function (req, res) {
    if(req.user) 
      var name = req.user.username;
    else
      return res.view('homepage', { user: req.user, data: req.params.data } );
    
    Entry.findOne({ slug:req.params.entry })
      .exec(function(err, entryData){
        if(err) return next(err);
        if(name == entryData.postedBy) {
          console.info(entryData.slug);
          Entry.destroy({ slug: entryData.slug });
          res.view('listing', { user: req.user, data: entryData });
        } else {
          console.info("Nope");
          res.view('listing', { user: req.user, data: entryData });
        }
      });
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
    var viewData = {
      entries: []
    };
    getEntry();
    function getEntry() {
      if (req.user) {
        var userid = req.user.id || "none";
        Entry.findOne({slug: req.params.slug})
        .populate('comments')
        .populate('votes', { user: userid })
        .exec(function (err, data) {
          viewData.entries = [data];
          getComments();
        });
      } else {
        Entry.findOne({slug: req.params.slug})
        .populate('comments')
        .exec(function (err, data) {
          viewData.entries.push(data);
          getComments();
        });
      }
    }

    function getComments() {
      var ids = _.pluck(viewData.entries[0].comments, 'id');
      Comment.find({id: ids})
      .populate('children')
      .populate('parent')
      .exec(function (err, data) {
        viewData.entries[0].comments = data;
        singleView();
      });
    }

    function singleView() {
      return res.view('entry', { user: req.user, data: viewData });
    }
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
