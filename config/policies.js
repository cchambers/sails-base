module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated',
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
    '*': 'isAuthenticated'
  },
  'SubController': {
    'new' : 'isAuthenticated',
    'edit': 'isOwner'
  }
};
