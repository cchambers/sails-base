module.exports = {
  attributes: {
    name: {
      type: 'string',
      minLength: 4,
      required: true,
      unique: true
    },

    tagline: {
      type: 'string'
    },

    creator: {
      type: 'string',
      required: true
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