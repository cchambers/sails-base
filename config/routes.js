module.exports.routes = {
  '/': 'FrontpageController.index',

  'get /login': {
    view: 'login'
  },

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /signup': {
    view: 'signup'
  },

  'get /userlist': 'FrontpageController.userlist',
  'post /op/make-admin': 'UserController.makeadmin',

  'get /entry/new': 'EntryController.new',
  'post /entry/new': 'EntryController.create',

  'get /sub/new': 'SubController.new',
  'post /sub/new': 'SubController.create',
  'get /sub/:sub': 'SubController.index',
  'get /sub/:sub/:entry': 'EntryController.index'


};