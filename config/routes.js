module.exports.routes = {
  '/': 'FrontpageController.listing',

  'get /userlist': 'FrontpageController.userlist',
  'get /sublist': 'FrontpageController.sublist',


  'get /signup':   { view: 'signup' },
  'get /login':    { view: 'login' },
  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /new/sub': 'SubController.new',
  'get /new/entry': 'EntryController.new',

  'post /op/make-admin': 'UserController.makeadmin',

  'get /sub/:sub': 'FrontpageController.listing',
  'get /sub/:sub/:slug': 'FrontpageController.single',

};