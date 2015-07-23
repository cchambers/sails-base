module.exports = {
  new: function (req, res) {
    data = {};
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      if (req.query.name) {
        data.name = req.query.name;
      }
      return res.view('new-sub', { user: req.user, data: data });
    }
  },
  
  edit: function (req, res) {
    Sub.findOne({ name: req.params.sub })
    .exec( function (err, subdata) {
      if(err) return next(err);
      var data = {};
      data.sub = subdata;
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
      return res.view('edit-sub', { user: req.user, data: data });
    });
  }
};

