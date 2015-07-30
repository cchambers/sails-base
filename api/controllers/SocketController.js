var passport = require("passport");

module.exports = {
  joinRoom: function (req, res) {
    var room = req.params.room;
    req.socket.join(room); 
    // this is the channel we send sub updates to
    var name = req.session.id;
    if (req.session.passport.user) {
      userid = req.session.passport.user;
      User.findOne(userid)
      .exec( function (err, doc) {
        doc.online = true;
        doc.save;
        // this is the channel that gets notifications
        req.socket.join(userid); 
        sails.sockets.broadcast("admin", "user-online", { id: userid })
        name = doc.username;
        if (doc.admin) {
          req.socket.join("admin");
          console.log("[ADMIN] " + name + " has come to save the day!")
          // this is the channel we get updates and notifications on
        }
        welcome();
      });
    } else {
      welcome();
    }

    function welcome() {
      // sails.sockets.broadcast(room, "new-user", { name: name })
      console.log(".io - " + name + " joined room " + room);
    }
  }
};
