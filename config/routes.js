module.exports.routes = {
  '/': 'EntryController.listing',

  'get /userlist': 'FrontpageController.userlist',
  'get /sublist': 'FrontpageController.sublist',

  'get /me': 'UserController.myProfile',

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'post /new/user': 'UserController.create',
  'post /new/name': 'NameController.create',
  'post /switch': 'NameController.switchTo',

  'get /new/sub': 'SubController.new',
  'post /new/sub': 'SubController.create',
  'get /new/entry': 'EntryController.new',
  'post /new/entry': 'EntryController.create',
  
  'get /edit/entry/:id': 'EntryController.edit',
  'post /edit/entry/:id': 'EntryController.submitEdit',
  
  'get /delete/entry/:id': 'EntryController.delete',

  'get /op/makeadmin': 'UserController.makeadmin',

  'get /sub/:sub': 'EntryController.listing',
  'get /sub/:sub/edit': 'SubController.edit',
  'post /sub/:sub/edit': 'SubController.submitEdit',
  'get /sub/:sub/:slug': 'EntryController.single',

  'get /verify/:id': 'UserController.verify',
  'get /user/:user': 'UserController.userProfile',

  'post /vote/:direction/:entry': 'VoteController.vote',

  'get /new/comment': 'CommentController.new',
  'post /comment/:id/reply': 'CommentController.reply',

  'post /new/comment': 'EntryController.addComment',

  'get /sockets/join/:room': 'SocketController.joinRoom'
};
