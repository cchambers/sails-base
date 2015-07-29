var passport = require('passport');
var utilities = require('../services/utilities');

module.exports = {
  joinRoom: function (req, res) {
    var room = req.params.room;
    req.socket.join(room);
    var name = req.session.id;
    //console.log(req.session)
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
      sails.sockets.broadcast(room, 'new-user', { name: name })
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
