module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated'
  },
  'FrontPageController': {
    'userlist': ['isAuthenticated', 'isAdmin']
  },
  'UserController': {
    'profile': 'isAuthenticated'
  },
  'VoteController': {
    '*': 'isAuthenticated'
  },
  'CommentController': {
    '*': 'isAuthenticated'
  }
};
