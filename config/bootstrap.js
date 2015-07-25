/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

 module.exports.bootstrap = function(cb) {
  var http = require('http');
  var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];
  module.exports = function (req, res, next) {
    // Initialize Passport
    passport.initialize()(req, res, function () {
      // Use the built-in sessions
      passport.session()(req, res, function () {
        // Make the user available throughout the frontend
        res.locals.user = req.user;
        // Make the request's passport methods available for socket
        if (req.isSocket) {
          for (var i = 0; i < methods.length; i++) {
            req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
          }
        }
        next();
      });
    });
  };
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
