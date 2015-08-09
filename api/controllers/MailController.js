var utilities = require('../services/utilities');

module.exports = {
  send: function(req, res) {
    var to = req.params.to;
    var success = utilities.sendMail(to);
    return res.json (success);
  }
};