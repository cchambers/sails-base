module.exports = {
  index: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage', { user: false });
    } else {
      return res.view('homepage', { user: req.user, sub: req.param('sub') });
    }
  },
  
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage', { user: false });
    } else {
      return res.view('new-sub', { user: req.user });
    }
  }
};

