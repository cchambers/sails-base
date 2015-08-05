module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated',
    'edit': ['isAuthenticated', 'isPostedBy'],
    'delete': ['isAuthenticated', 'isPostedBy']
  },
  'FrontPageController': {
  },
  'AdminController': {
    '*': 'isAdmin'
  },
  'UserController': {
    'list': ['isAuthenticated', 'isAdmin'],
    'myProfile': 'isAuthenticated'
  },
  'CommentController': {
    'create': 'isAuthenticated',
    'reply': 'isAuthenticated'
  },
  'SubController': {
    'list': 'isAuthenticated',
    'edit': ['isAuthenticated','isSubOwner']
  },
  'VoteController': {
    '*': 'isAuthenticated'
  },
  'NameController': {
    '*': 'isAuthenticated'
  }
};
