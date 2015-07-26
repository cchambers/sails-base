module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated',
    'edit': ['isAuthenticated', 'isPostedBy'],
    'delete': ['isAuthenticated', 'isPostedBy']
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
    'create': 'isAuthenticated',
    'reply': 'isAuthenticated'
  },
  'SubController': {
    'edit': ['isAuthenticated','isSubOwner']
  }
};
