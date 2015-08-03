module.exports = {
  attributes: {
    name: {
      type: 'string',
      minLength: 1,
      required: true,
      unique: true
    },

    slug: {
      type: 'string',
      minLength: 4,
      required: true,
      unique: true
    },

    tagline: {
      type: 'string'
    },

    creator: {
      model: 'name'
    },

    open: {
      type: 'boolean',
      defaultsTo: true
    },

    nsfw: {
      type: 'boolean',
      defaultsTo: false
    },

    nsfl: {
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
    },

    posts: {
      collection: 'entry',
      via: 'slug'
    }
  }
};