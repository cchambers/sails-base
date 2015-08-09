module.exports = {
  attributes: {
    title: {
      type: 'string',
      minLength: 2,
      required: true
    },

    media: {
      type: 'string',
      minLength: 2,
      unique: true,
      required: true
    },

    postedTo: {
      type: 'string',
    },

    postedBy: {
      type: 'string',
    },

    user: {
      type: 'string'
    },
    
    nsfw: {
      type: 'boolean',
      defaultsTo: false
    },

    nsfl: {
      type: 'boolean',
      defaultsTo: false
    },
    
    reviewed: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
