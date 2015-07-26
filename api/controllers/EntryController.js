var utilities = require('../services/utilities');

module.exports = {
  new: function (req, res) {
    var data = {};

    if (req.query.sub) {
      data.prefill = req.query.sub;
    }
    return res.view("new-entry", { user: req.user, data: data });
  },

  create: function (req, res) {
    var succeed = true;

    function errOut(data) {
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
      subSlug: "",
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

    Name.findOne({ name: req.user.username })
    .exec( function (err, name) {
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
            entry.postedBy = name.id;
            entry.subSlug = doc.slug;
            entry.ups = 1;
            if (succeed) {
              console.log(entry)
              createEntry(entry);
            }
          }
        });
      });
    });

    function createEntry(entry) {
      Entry.create(entry)
      .exec( function (err, entry) {
        console.log("Entry created:", entry.subSlug + "/" + entry.slug);
        Vote.create({
          user: req.user.id,
          name: entry.postedBy,
          entry: entry.id,
          vote: true
        }).exec( function (err, vote) {
          return res.json({ message: "Success!", redirect: "/sub/" + entry.subSlug + "/" + entry.slug });
        })
      });
    }
  },

  tag: function (req, res) {
    var tag = req.body.tag;
    var id = req.body.id;
    var user = req.user;

    Entry.findOne(id)
    .exec(function (err, doc) {
      if (doc[tag]) {
        doc[tag] = false;
      } else {
        doc[tag] = true;
      }
      doc.save();

      if (user.admin) {
        console.log("[ADMIN] " + user.username + " toggled " + tag + " tag on entry " + doc.title)
      } else {
        console.log("No admin")
      }
      return res.json({ message: "Success!" })
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
    .exec( function (err, doc) {
      if (err) return next(err);
      return res.json({ message: 'Post deleted!', success: true });
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
        Sub.findOne({ slug: slug })
        .populate('creator')
        .exec( function (err, doc) {
          if (err) return next(err);
          if (doc) {
            listingData.sub = doc;
            Entry.find({ postedTo: listingData.sub.id })
            .sort({ createdAt: 'desc' })
            .populate('comments')
            .populate('postedTo')
            .populate('postedBy')
            .populate('votes', { user: userid })
            .exec( function (err, data) {
              if (err) return next(err);
              for (var i = 0; i < data.length; i++){
                data[i].commentAmmount = data[i].comments.length;  
              }
              listingData.entries = data;
              listingView();
            });
          } else {
            return res.redirect("/new/sub?name="+req.params.sub)
          }
        });
      } else {
        Entry.find({})
        .populate('comments')
        .populate('postedTo')
        .populate('postedBy')
        .populate('votes', { user: userid })
        .exec( function (err, data) {
          if (err) return next(err);
          for(j = 0; j < data.length; j++){
            data[j].commentAmmount = data[j].comments.length;
          }
          data = utilities.sortByScore(data);
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
    if (req.params.sub) {
      getSub();
    } else {
      getEntry();
    }

    function getSub() {
      Sub.findOne({ name: req.params.sub })
      .exec( function (err, doc) {
        viewData.sub = doc;
        getEntry();
      });
    }

    function getEntry() {
      if (req.user) {
        var userid = req.user.id || "none";
        Entry.findOne({ slug: req.params.slug })
        .populate('comments')
        .populate('postedTo')
        .populate('postedBy')
        .populate('votes', { user: userid })
        .exec( function (err, doc) {
          viewData.entries.push(doc);
          doc.commentAmmount = doc.comments.length;
          //getComments();
          singleView();
        });
      } else {
        Entry.findOne({ slug: req.params.slug })
        .populate('comments')
        .populate('postedTo')
        .populate('postedBy')
        .exec(function (err, data) {
          viewData.entries.push(data);
          if (data.comments) {
            data.commentAmmount = data.comments.length;
            //getComments();
          }
          singleView();
        });
      }
    }

    function getComments() {
      var ids = _.pluck(viewData.entries[0].comments, 'id');
      Comment.find({id: ids, parent: {$eq: null}})
      .populate('children')
      .populate('parent')
      .populate('postedBy')
      .exec( function (err, data) {
        viewData.entries[0].comments = data;
        singleView();
      });
    }

    function singleView() {
      return res.view('entry', { user: req.user, data: viewData });
    }
  }

};
