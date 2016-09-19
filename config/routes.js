module.exports.routes = {

  '/': 'FrontpageController.index',
  
  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /userlist': 'UserController.list',
  'get /offline': 'UserController.offline',
  'get /me': 'UserController.myProfile',
  'get /verify/:id': 'UserController.verify',
  'get /user/:user': 'UserController.userProfile',
  'get /get-verified': 'UserController.getVerified',
  // 'get /op/makeadmin': 'UserController.makeadmin',

  'get /sockets/join/:room': 'SocketController.joinRoom',

  'get /mail/send/:to': 'MailController.send',

  'get /404': 'ErrorController.fourOhFour',
  'get /403': 'ErrorController.fourOhThree',
  'get /500': 'ErrorController.fiveOhOh'

};
