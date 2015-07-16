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
    console.log(req.params.sub)
    Sub.findOne({ name: req.params.sub })
      .exec( function (err, data) {
        if(err) return next(err);
        console.log("%j",data);
        data.sub = data;
        return res.view('edit-sub', { user: req.user, data: data });
      });
  },
  
  submitEdit: function (req, res) {
    
  }
};

