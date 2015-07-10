module.exports.routes = {
  '/': 'FrontpageController.init',

  'get /login': {
    view: 'login'
  },

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /signup': {
    view: 'signup'
  },

  'get /userlist': 'FrontpageController.userlist',
  'get /make-admin': 'UserController.makeadmin',
};