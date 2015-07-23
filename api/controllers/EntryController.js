module.exports = {
  new: function (req, res) {
    var data = {};
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      if (req.query.sub) {
        data.prefill = req.query.sub;
      }
      return res.view("new-entry", { user: req.user, data: data });
    }
  },

  create: function (req, res) {
    console.log(req.body)
    var succeed = true;

    function errOut(data) {
      console.log("WELL?", succeed);
      return res.json(data);
    }

    var entry = {
      postedBy: req.body.postedBy,
      title: req.body.title,
      slug: req.body.slug,
      media: req.body.media || "",
      markdown: req.body.markdown || "",
      content: req.body.content || "",
      postedTo: req.body.postedTo,
    }

    if (entry.postedBy != req.user.username) {
      succeed = false;
      errOut({ message: "Something's not right here." });
    }

    if (entry.title == "") {
      succeed = false;
      errOut({ message: "Need a title." });
    }
    if (entry.slug == "") {
      succeed = false;
      errOut({ message: "Bad slug." });
    }
    if (entry.postedTo == "") {
      succeed = false;
      errOut({ message: "Pick a sub!" });
    }

    Entry.findOne({slug: entry.slug})
    .exec( function (err, doc) {
      if (doc) {
        succeed = false;
        errOut({ message: "Need a unique slug." });
      } 
      Sub.findOne({slug: entry.postedTo})
      .exec( function (err, doc) {
        if (!doc) {
          succeed = false;
          return res.json({ message: "That sub doesn't exist." });
        } else {
          entry.postedTo = doc.id;
          if (succeed) {
            Entry.create(entry)
            .exec( function (err, entry) {
              console.log("Entry created:", doc.slug + "/" + entry.slug);
              return res.json({ message: "Success!", redirect: "/sub/" + doc.slug + "/" + entry.slug });
            });
          } 
        }
      });
    });
  },
  
  edit: function(req, res) {
    Entry.findOne({ id: req.params.id })
    .populate('postedTo')
    .exec( function(err, doc) {
      if (err) return next(err);
      var data = {};
      data.entry = doc;
      return res.view("edit-entry", { user: req.user, data: data });
    });
  },
  
  submitEdit: function(req, res) {
    Entry.findOne(req.params.id)
    .exec( function (err, doc) {
      if (err) return next(err);
      doc.content = req.body.content;
      doc.markdown = req.body.markdown;
      doc.save();
      return res.json({ message: "Success!", redirect: "/sub/" + req.params.postedTo + "/" + doc.slug });
    });
  },
  
  delete: function (req, res) {
    Entry.destroy(req.params.id)
    .exec( function(err, doc) {
      return res.redirect("/sub/" + doc[0].postedTo.slug);
    });
  },

  listing: function (req, res) {
    var listingData = {};
    var slug = req.params.sub || false;

    function listingView() {
      return res.view('entry', { user: req.user, data: listingData })
    }

    function getEntries() {
      if (req.user) {
        var userid = req.user.id || "none";
      }
      if (slug) {
        console.log("ACCESSING " + slug)

        Sub.findOne({ slug: slug })
        .exec( function (err, doc) {
          if (err) return next(err);
          if (doc) {
            listingData.sub = doc;
            Entry.find({ postedTo: listingData.sub.id })
            .sort({ createdAt: 'desc' })
            .populate('comments')
            .populate('postedTo')
            .populate('votes', { user: userid })
            .exec( function (err, data) {
              if (err) return next(err);
              listingData.entries = data;
              listingView();
            });
          } else {
            return res.redirect("/new/sub?name="+req.params.sub)
          }
        });
        
      } else {
        Entry.find({})
        .sort({createdAt: 'desc'})
        .populate('comments')
        .populate('postedTo')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          listingData.entries = data;
          listingView();
        });
      }
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
        .populate('postedTo')
        .populate('votes', { user: userid })
        .exec(function (err, data) {
          viewData.entries = [data];
          getComments();
        });
      } else {
        Entry.findOne({slug: req.params.slug})
        .populate('comments')
        .populate('postedTo')
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

          if (err) return next(err);

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
