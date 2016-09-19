var Utilities = require('../services/Utilities');

module.exports = {
  send: function(req, res) {
    var to = req.params.to;
    var success = Utilities.sendMail(to);
    return res.json (success);
  }
};