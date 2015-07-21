module.exports.routes = {
  '/': 'EntryController.listing',

  'get /userlist': 'FrontpageController.userlist',
  'get /sublist': 'FrontpageController.sublist',

  'get /me': 'UserController.myProfile',

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'get /new/sub': 'SubController.new',
  'get /new/entry': 'EntryController.new',
  'get /sub/:sub/:entry/delete': 'EntryController.delete',

  'get /op/makeadmin': 'UserController.makeadmin',

  'get /sub/:sub': 'EntryController.listing',
  'get /sub/:sub/edit': 'SubController.edit',
  'post /sub/:sub/edit': 'SubController.submitEdit',
  'get /sub/:sub/:slug': 'EntryController.single',

  'get /user/:user': 'UserController.userProfile',

  'post /vote/:direction/:entry': 'VoteController.vote',

  'get /new/comment': 'CommentController.new',
  'post /comment/:id/reply': 'CommentController.reply',

  'post /new/comment': 'EntryController.addComment',

  'get /sockets/join/:room': 'SocketController.joinRoom'
};
