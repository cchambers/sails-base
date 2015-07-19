module.exports = {

  new: function (req, res) {
    data = 'undefined';
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      //return res.view('new-sub', { user: req.user, data: false });
      return res.view('new-sub', { user: req.user, data: data });
    }
  },
  
  edit: function (req, res) {
    var data = {};
    if(!req.user) return res.view('login', { user: req.user, data: data } );
    Sub.findOne({ name: req.params.sub })
    .exec( function (err, subdata) {
      if(err) return next(err);
      data.sub = subdata;
      if(data.sub.creator != req.user.namename) return res.view('homepage',{ user: req.user, data: data });
      return res.view('edit-sub', { user: req.user, data: data });
    });
  },
  
  submitEdit: function (req, res) {
    //TODO: Apply a security measure.
//    console.log(req.body);
    Sub.findOne({ name: req.params.sub })
    .exec( function(err, doc) {
      if(err) return next(err);
      doc.tagline = req.body.tagline;
//      console.log(doc);
      doc.save();
      data = {};
      data.sub = doc;
      return res.view('edit-sub', { user: req.user, data: data });
    });
  }
};

