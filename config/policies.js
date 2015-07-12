module.exports.policies = {
  '*': true,
  'EntryController': {
    'new': 'isAuthenticated'
  },
  'FrontPageController': {
    'userlist': 'isAdmin'
  }
};
