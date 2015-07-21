var passport = require('passport');

module.exports = {
  joinRoom: function (req, res) {
    var room = req.params.room;
    req.socket.join(room);
    if (req.user) {
      name = req.user.username;
    }

    console.log("SOCKETS: " + req.socket.id + " joined room " + room);
    res.json({
      message: 'Subscribed to a fun room called '+room+'!'
    });
  }
};
