module.exports = {
  index: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage', { user: false });
    } else {
      return res.view('entry', { user: req.user });
    }
  },
  
  new: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage', { user: false });
    } else {
      return res.view('new-entry', { user: req.user });
    }
  }
};

