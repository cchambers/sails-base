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

    open: {
      type: 'boolean',
      defaultsTo: true
    },

    nsfw: {
      type: 'boolean',
      defaultsTo: false
    },

    style: {
      type: 'string'
    },

    information: {
      type: 'string'
    },

    moderators: [{
      type: 'string'
    }],
    
    css: {
      type: 'string'
    }
  }
};