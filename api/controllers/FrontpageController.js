var Utilities = require('../services/Utilities');

function next(err, res) {
  return res.json({ message: "Error.", error: err })
}

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    var viewdata = {
      images: [],
      text: [],
      links: [],
      videos: [],
      entries: []
    }

    var query = { where: { nsfw: false }, limit: 50, skip: 0, sort: 'createdAt DESC' };

    if (req.user) { // TODO: address user settings here:
      query = { where: { nsfw: false }, limit: 50, skip: 0, sort: 'createdAt DESC' }
    }

    loadView();

    function loadView(){
      return res.view('front-page', { user: req.user, data: viewdata })
    }
  },

};
