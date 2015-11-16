module.exports = {
  new: function (req, res) {
    var data = {};
    if (req.query.name) {
      data.prefill = req.query.name;
    }
    return res.view('new-sub', { user: req.user, data: data });
  },

  create: function (req, res) {
    // SANITIZE SLUG AND NAME
    // check if slug or name exists
    console.log(req.body);
    Sub.find({ $or: [ { name: req.body.name }, { slug: req.body.slug } ] })
    .exec( function (err, data) {
      if(err) return next(err);
      if (data.length > 0) {
        // console.log(data);
        return res.json({ message: "Failure! Sub or slug exists." });
      } else {
        console.log("Creating sub:",req.body);
        Name.findOne({ name: req.user.username })
        .exec(function (err, doc) {
          var data = req.body;
          data.creator = doc.id;
          // console.log("DATA!", data);
          Sub.create(data)
          .exec( function (err, doc) {
            return res.json({ message: "Success!", redirect: "/sub/" + req.body.slug });
          });
        })
      }
    });
  },

  subsJSON: function (req, res) {
    Sub.find()
    .exec( function (err, data) {
      filterData(data)
    });

    function filterData(data) {
      var returnData = [];
      for (doc in data) {
        var sub = {
          "id": data[doc].id,
          "name": data[doc].name,
          "slug": data[doc].slug
        }
        returnData.push(sub);
      }
      return res.json(returnData);
    }
  },
  
  edit: function (req, res) {
    Sub.findOne({ slug: req.params.sub })
    .populate('creator')
    .exec( function (err, doc) {
      if(err) return next(err);
      var data = {};
      data.sub = doc;
      return res.view('edit-sub', { user: req.user, data: data });
    });
  },
  
  submitEdit: function (req, res) {
    Sub.findOne({ name: req.params.sub })
    .exec( function(err, doc) {
      if(err) return next(err);
      doc.tagline = req.body.tagline;
      doc.css = req.body.css;
      doc.save();
      data = {};
      data.sub = doc;
      return res.json({ message: "Updated.", reload: true });
    });
  },

  list: function (req, res) {
    var query = { where: { nsfw: false } }
    Sub.find(query)
    .populate('creator')
    .exec( function (err, data) {
      if (err) return next(err);
      return res.view('sublist', { user: req.user, data: data })
    });
  }
};

