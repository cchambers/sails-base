var passport = require('passport');

module.exports = {
  joinRoom: function (req, res) {
    var room = req.params.room;
    req.socket.join(room);
    var name = "Unauthenticated socket id " +req.session.id;
    if (req.session.passport.user) {
      userid = req.session.passport.user;
      User.findOne(userid)
      .exec( function (err, doc) {
        var username = doc.username;
        name = username;
        welcome();
      });
    } else {
      welcome();
    }

    function welcome() {
      sails.sockets.broadcast(room, 'new-user', {
        name: name
      })

      console.log(".io - " + name + " joined room " + room);
      return res.json({
        message: 'Success!'
      });
    }
  }
};
