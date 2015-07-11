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

  'get /new/entry': 'EntryController.new',
  'post /new/entry': 'EntryController.create',

  'get /new/sub': 'SubController.new',
  'post /new/sub': 'SubController.create',
  
  'get /sub/:sub': 'SubController.index',
  'get /sub/:sub/:entry': 'EntryController.index'


};