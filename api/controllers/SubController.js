module.exports = {
  
  new: function (req, res) {
    data = 'undefined';
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-sub', { user: req.user, data: data });
    }
  },
  
  edit: function (req, res) {
    Sub.findOne({ name: req.params.sub })
      .exec( function (err, data) {
        if(err) return next(err);
        data.sub = data;
        return res.view('edit-sub', { user: req.user, data: data });
      });
  },
  
  submitEdit: function (req, res) {
    Sub.findOne({ name: req.params.sub })
    .exec( function(err, data) {
      if(err) return next(err);
      data.sub = data;
//      if(req.body.tagline) {
//        data.sub.tagline = req.body.tagline;
//      }
//    Throws Error: There was an error turning the model into an object.  
      data.save(function(err) { if(err) next(err); });
      
      return res.view('edit-sub', { user: req.user, data: data });
    });
  }
};

