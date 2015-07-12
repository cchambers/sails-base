module.exports.routes = {
  '/': 'FrontpageController.index',

  'get /userlist': 'FrontpageController.userlist',
  'get /sublist': 'FrontpageController.sublist',


  'get /signup': {
    view: 'signup'
  },
  'get /login': {
    view: 'login'
  },
  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /new/sub': 'SubController.new',


  'post /op/make-admin': 'UserController.makeadmin',
  
};