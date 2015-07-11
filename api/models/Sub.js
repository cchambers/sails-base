module.exports = {
  attributes: {
    name: {
      type: 'string',
      minLength: 4,
      unique: true
    },

    tagline: {
      type: 'string'
    },

    creator: {
      type: 'string'
    },

    style: {
      type: 'string'
    },

    information: {
      type: 'string'
    },

    moderators: [{
      type: 'string'
    }]
  }
};