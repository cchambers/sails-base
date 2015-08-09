var passport = require('passport');
var utilities = require('../services/utilities');

module.exports = {
  joinRoom: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest("That's not how this works... that's not how any of this works.");
    }

    req.socket.on("close", function (data) {
      console.log("Socket closed connection.")
    })

    var room = req.params.room;
    req.socket.join(room); 
    // this is the channel to which we send sub updates
    req.socket.join("blasts"); 
    // this is the channel to which we send global notices and such
    var name = req.session.id;
    if (req.session.passport.user) {
      userid = req.session.passport.user;
      User.findOne(userid)
      .exec( function (err, doc) {
        doc.online = true;
        doc.save();
        User.subscribe(req, userid, ['destroy']);
        // this is the channel that gets notifications
        req.socket.join(userid); 
        sails.sockets.broadcast("admin", "user-online", { id: userid })
        name = doc.username;
        if (doc.admin) {
          req.socket.join("admin");
          console.log("[ADMIN] " + name + " has come to save the day!")
          // this is the channel on which we get updates and notifications
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
  },
  
  userToggleSetting: function (req, res) {
    var name = req.session.passport.user;
    utilities.updateUser(name);
    User.findOne({ id: name })
    .exec( function (err, doc) {
      var username = doc.username;
      
      if(req.body.setting == 'nsfw') {
        if(doc.hidensfw)
          doc.hidensfw = false;
        else
          doc.hidensfw = true;
      }
      if(req.body.setting == 'nsfl') {
        if(doc.hidensfl)
          doc.hidensfl = false;
        else
          doc.hidensfl = true;
      }
      doc.save();
      return res.json({ message: "Success!", redirect: "/me" });
    });
  }
};
