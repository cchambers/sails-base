module.exports = {
  
  new: function (req, res) {
    data = null;
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-sub', { user: req.user, data: data});
    }
  }
};

