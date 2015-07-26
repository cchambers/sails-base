module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated',
    'edit': ['isAuthenticated', 'isPostedBy'],
    'delete': ['isAuthenticated', 'isPostedBy']
  },
  'FrontPageController': {
    'userlist': ['isAuthenticated', 'isAdmin'],
    'sublist': 'isAuthenticated'
  },
  'UserController': {
    'myProfile': 'isAuthenticated'
  },
  'CommentController': {
    'create': 'isAuthenticated',
    'reply': 'isAuthenticated'
  },
  'SubController': {
    'edit': ['isAuthenticated','isSubOwner']
  },
  'VoteController': {
    '*': 'isAuthenticated'
  },
  'NameController': {
    '*': 'isAuthenticated'
  }
};
