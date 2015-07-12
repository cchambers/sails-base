module.exports = {
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.redirect('/');
    } else {
      return res.view('new-entry', { user: req.user });
    }
  }
};

