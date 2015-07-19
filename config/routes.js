module.exports.routes = {
  '/': 'FrontpageController.listing',

  'get /userlist': 'FrontpageController.userlist',
  'get /sublist': 'FrontpageController.sublist',

  'get /me': 'UserController.myProfile',

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /new/sub': 'SubController.new',
  'get /new/entry': 'EntryController.new',

  'get /op/makeadmin': 'UserController.makeadmin',

  'get /sub/:sub': 'FrontpageController.listing',
  'get /sub/:sub/:slug': 'FrontpageController.single',

  'get /user/:user': 'UserController.userProfile',

  'post /vote/:direction/:entry': 'VoteController.vote',

  'get /new/comment': 'CommentController.new',
  'post /comment/:id/reply': 'CommentController.reply',

  'post /new/comment': 'EntryController.addComment',
};
