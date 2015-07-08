module.exports.policies = {
  '*': true,
  'PostController': {
    '*': 'isAuthenticated'
  },
  'FrontpageController': {
    '*': 'isAuthenticated'
  },

};
