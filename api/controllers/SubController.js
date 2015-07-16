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
    data = 'undefined';
    var util = require('util');

    Sub.findOne({ user: req.params.sub })
      .exec( function (err, subData) {
        if(err) return next(err);
        return res.view('edit-sub', { user: req.user, data: subData });
      });
  }
};

