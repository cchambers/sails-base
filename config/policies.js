module.exports.policies = {
  '*': true,
  'EntryController': {
    '*': 'isAuthenticated'
  },
  'FrontPageController': {
    'userlist': 'isAdmin'
  }
};
