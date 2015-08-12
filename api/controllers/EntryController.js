var utilities = require('../services/utilities');

module.exports = {
  new: function (req, res) {
    var data = {};
    if (req.params.sub) {
      data.prefill = req.params.sub
    }
    Name.find({ user: req.user.id })
    .exec( function (err, names) {
      if (names) data.names = names;
      return res.view("new-entry", { user: req.user, data: data });
    });
  },

  updateAll: function (req, res) {
    Entry.find()
    .exec( function (err, data) {
      for (var x = 0; x < data.length; x++) {
        Entry.findOne(data[x].id)
        .populate('subs')
        .exec( function (err, doc) {
          doc.subs.add(doc.postedTo);
          doc.save( function(error) {
            if(error) {
              console.log(error);
              return res.json({ message: "Nope." });
            } else {
              console.log(doc);
            }
          });
        });
      }
      return res.json({ message: "Maybe?" });
    });
  },

  create: function (req, res) {
    var succeed = true;
    var postedTo = req.body.postedTo.split(" ");
    console.log("subs:",postedTo);
    function errOut(data) {
      return res.json(data);
    }
    
    if(req.body.nsfw == 'on')
      req.body.nsfw = true;
    else
      req.body.nsfw = false;
    
    if(req.body.nsfl == 'on')
      req.body.nsfl = true;
    else
      req.body.nsfl = false;
    
    var entry = {
      postedBy: req.body.postedBy,
      title: req.body.title,
      slug: req.body.slug,
      media: req.body.media || "",
      markdown: req.body.markdown || "",
      content: req.body.content || "",
      subs: [],
      subSlug: "",
      nsfw: req.body.nsfw,
      nsfl: req.body.nsfl
    }

    if (entry.title == "") {
      succeed = false;
      errOut({ message: "Need a title." });
    }
    if (entry.slug == "") {
      succeed = false;
      errOut({ message: "Bad slug." });
    }
    if (postedTo.length == 0) {
      succeed = false;
      errOut({ message: "Pick a sub!" });
    }

    Name.findOne({ name: entry.postedBy })
    .exec( function (err, name) {
      // if name belongs to user
      if (name.user != req.user.id) {
        return res.json({ message: "Nice try, bub." });
      }

      Entry.findOne({slug: entry.slug})
      .exec( function (err, doc) {
        if (doc) {
          succeed = false;
          errOut({ message: "Need a unique slug." });
        }

        entry.postedBy = name.id;
        entry.ups = 1;

        getSubs(0);
      });
    });


    function getSubs(which) {
      var slug = postedTo[which];
      console.log("getting " + slug);
      Sub.findOne({ slug: slug })
      .exec( function (err, doc) {
        if (!doc) {
          succeed = false;
          return res.json({ message: "That sub ("+slug+") doesn't exist." });
        } else {
          entry.subs.push(doc.id);
          which++;
          if (postedTo[which] != undefined) {
            getSubs(which);
          } else {
            if (succeed) {
              createEntry(entry);
            }
          }
        }
      });
    }

    function createEntry(entry) {
      Entry.create(entry)
      .populate('subs')
      .exec( function (err, doc) {
        if (err) next(err);
        console.log("Entry created:", postedTo[0] + "/" + doc.slug);
        Vote.create({
          user: req.user.id,
          name: doc.postedBy,
          entry: doc.id,
          vote: true
        }).exec( function (err, vote) {
          return res.json({ message: "Success!", redirect: "/sub/" + postedTo[0] + "/" + doc.slug });
        })
      });
    }
  },

  singleJSON: function (req, res) {
    var userid = (req.session.passport.user) ? req.session.passport.user : "none";
    // console.log(userid);
    var id = req.params.id;
    Entry.findOne(id)
    .populate('comments')
    .populate('postedTo')
    .populate('postedBy')
    .populate('subs')
    .populate('votes', { user: userid })
    .exec( function (err, doc) {
      if (err) next(err);
      if (doc) {
        var ids = _.pluck(doc.comments, 'id');
        Comment.find({id: ids, parent: {$eq: null}})
        .populate('children')
        .populate('parent')
        .populate('postedBy')
        .exec( function (err, data) {
          data = { entry: doc, comments: data };
          sendData(data);
        });
      } else {
        data = { entry: doc, comments: false };
        sendData(data);
      }
    });

    function sendData(data) {
      return res.json(data);
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
    .populate('postedBy')
    .populate('subs')
    .exec( function(err, doc) {
      if (err) return next(err);
      var data = {};
      data.entry = doc;
      return res.view("edit-entry", { user: req.user, data: data });
    });
  },

  submitEdit: function (req, res) {
    Entry.findOne(req.params.id)
    .populate('postedTo')
    .populate('subs')
    .exec( function (err, doc) {
      if (err) return next(err);
      doc.content = req.body.content;
      doc.markdown = req.body.markdown;
      doc.save();
      return res.json({ message: "Success!", redirect: "/sub/" + doc.subs[0].slug + "/" + doc.slug });
    });
  },

  delete: function (req, res) {
    Entry.destroy(req.params.id)
    .exec( function (err, doc) {
      if (err) return next(err);
      return res.json({ message: "Post deleted!", success: true });
    });
  },

  list: function (req, res) {
    Entry.find()
    .populate('subs')
    .exec(function (err, data) {
      return res.json(data);
    })
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
          if (data) {
            if (err) return next(err);
            for(j = 0; j < data.length; j++){
              data[j].commentAmmount = data[j].comments.length;
            }
            var userData = undefined;
            utilities.getUserData(userid, function (err, ud) {
              if(err) mext(err)
                if(ud) userData = ud;
//              console.info(ud);
});
            console.log(userData);
            if(userData) {
              console.info("Got the user!");
              console.info(userData);
              if(userData.hidensfw == true) {
                conosle.info("Must hide NSFW stuff!");
                for(d in data) {
                  if(d.nsfw) {
                    console.info(d);
                    d = undefined;
                  }
                }
              }
            }
            data = utilities.sortByPop(data);
            listingData.entries = data;
            listingView();
          }
        });
}
}
getEntries();
},

single: function (req, res) {
  var viewData = {
    entries: []
  };

  getSub();

  function getSub() {
    Sub.findOne({ slug: req.params.sub })
    .exec( function (err, doc) {
      if (doc) {
        viewData.sub = doc;
        getEntry();
      } else {
        return res.json({ message: "Sub doesn't exist" });
      }
    });
  }

  function getEntry() {
    if (req.user) {
      var userid = req.user.id || "none";
      Entry.findOne({ slug: req.params.slug })
      .populate('comments')
      .populate('postedTo')
      .populate('subs')
      .populate('postedBy')
      .populate('votes', { user: userid })
      .exec( function (err, doc) {
        viewData.entries.push(doc);
        doc.commentAmmount = doc.comments.length;
        getComments();
      });
    } else {
      Entry.findOne({ slug: req.params.slug })
      .populate('comments')
      .populate('postedTo')
      .populate('subs')
      .populate('postedBy')
      .exec(function (err, data) {
        viewData.entries.push(data);
        if (data) {
          data.commentAmmount = data.comments.length;
          getComments();
        } else {
          console.log("500 ERROR: NON ENTRY -> ", req.params.sub + " / " + req.params.slug)
          return res.redirect("/");
        }
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
