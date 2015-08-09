module.exports.routes = {
  '/': 'FrontpageController.index',
  'get /all': 'EntryController.listing',
  'get /userlist': 'UserController.list',
  'get /sublist': 'SubController.list',

  'get /me': 'UserController.myProfile',

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  'post /new/user': 'UserController.create',
  'post /new/name': 'NameController.create',
  'post /switch': 'NameController.switchTo',

  'get /new/sub': 'SubController.new',
  'post /new/sub': 'SubController.create',
  'get /new/entry': 'EntryController.new',
  'get /new/entry/:sub': 'EntryController.new',
  'post /new/entry': 'EntryController.create',
  'post /get/entry/:id': 'EntryController.singleJSON',
  'get /get/entry/:id': 'EntryController.singleJSON',
  
  'get /edit/entry/:id': 'EntryController.edit',
  'post /edit/entry/:id': 'EntryController.submitEdit',
  'post /delete/entry/:id': 'EntryController.delete',
  'post /tag/entry': 'EntryController.tag',

  // 'get /op/makeadmin': 'UserController.makeadmin',

  'get /sub/:sub': 'EntryController.listing',
  'get /sub/:sub/edit': 'SubController.edit',
  'post /sub/:sub/edit': 'SubController.submitEdit',
  'get /sub/:sub/:slug': 'EntryController.single',

  'get /verify/:id': 'UserController.verify',
  'get /user/:user': 'UserController.userProfile',
  'get /get-verified': 'UserController.getVerified',

  'post /vote/:direction/:entry': 'VoteController.vote',

  'post /new/comment': 'CommentController.create',
  'get /children/:id': 'CommentController.children',
  'post /children/:id': 'CommentController.children',

  'get /sockets/join/:room': 'SocketController.joinRoom',
  'post /sockets/settings/toggle': 'SocketController.userToggleSetting',

  'get /mail/send/:to': 'MailController.send',
  
  'get /bot/get/': 'BotController.get',
  'post /bot/approve/:id': 'BotController.approve',
  'post /bot/ignore/:id': 'BotController.ignore',

  'get /admin': 'AdminController.index',
  'get /admin/botted': 'AdminController.listBotted'


};
