/**
 * FrontpageController
 *
 * @description :: Server-side logic for managing frontpages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 /*/

 module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  loggedIn: function(req, res) {
    return res.view('homepage', { username: req.user.email });
  }
};

