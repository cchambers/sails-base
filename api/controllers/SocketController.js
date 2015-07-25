var passport = require('passport');

module.exports = {
  joinRoom: function (req, res) {
    console.log(req);
    var room = req.params.room;
    req.socket.join(room);
    var name = req.socket.id;
    if (req.user) {
      name = req.user.username;
    }

    sails.sockets.broadcast(room, 'new-user', {
      name: name
    })

    console.log("SOCKETS: " + req.socket.id + " joined room " + room);
    res.json({
      message: 'Subscribed to a fun room called '+room+'!'
    });
  }
};
