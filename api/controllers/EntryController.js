module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-entry', { user: req.user, data: false });
    }
  },
  
  edit: function(req, res) {
    Entry.findOne({ id: req.params.id })
      .exec( function(err, entryData) {
        if(err) return next(err);
        var data = {};
        data.entry = entryData;
        return res.view('edit-entry', { user: req.user, data: data });
    });
  },
  
  submitEdit: function(req, res) {
    Entry.findOne({ id: req.params.id })
      .exec( function(err, entryData) {
        if(err) return next(err);
        entryData.content = req.body.content;
        entryData.markdown = req.body.markdown;
        entryData.save();
        return res.redirect('/sub/' + entryData.postedTo + '/' + entryData.slug);
    });
  },
  
  delete: function (req, res) {
    Entry.findOne({ id: req.params.id })
      .exec( function(err, entryData) {
        Entry.destroy({ slug: entryData.slug })
          .exec( function(err, eData) {
            return res.redirect('/')
          });
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
