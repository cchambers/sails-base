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
  },

  init: function (req, res) {
    if ( typeof(req.user) == 'undefined' ) {
      return res.view('homepage', { user: false });
    } else {
      // console.log(req.user)
      return res.view('homepage', { user: req.user });
    }
  },
  socket: function (req, res) {
    var socket = req.socket;
    var io = sails.io;
    
    // emit to all sockets (aka publish)
    // including yourself
    io.sockets.emit('messageName', {thisIs: 'theMessage'});
    
    // broadcast to a room (aka publish)
    // excluding yourself, if you're in it
    socket.broadcast.to('roomName').emit('messageName', {thisIs: 'theMessage'});
    
    // emit to a room (aka publish)
    // including yourself
    io.sockets.in('roomName').emit('messageName', {thisIs: 'theMessage'});
    
    // Join a room (aka subscribe)
    // If you're in the room already, no problem, do nothing
    // If the room doesn't exist yet, it gets created
    socket.join('roomName');
    
    // Leave a room (aka unsubscribe)
    // If you're not in the room, no problem, do nothing
    // If the room doesn't exist yet, no problem, do nothing
    socket.leave('roomName');
    
    // Get all connected sockets in the app
    sails.io.sockets.clients();
    
    // Get all conneted sockets in the room, "roomName"
    sails.io.sockets.clients('roomName');
    
  }
};

