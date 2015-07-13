module.exports = {
  attributes: {
    title: {
      type: 'string',
      minLength: 2,
      required: true
    },

    slug: {
      type: 'string',
      required: true,
      unique: true
    },

    media: {
      type: 'string',
      minLength: 2
    },

    content: {
      type: 'string'
    },

    markdown: {
      type: 'string'
    },

    postedTo: {
      type: 'string',
      required: true
    },

    crossPostedTo: [{
      type: 'string'
    }],

    postedBy: {
      type: 'string'
    },

    ups: {
      type: 'integer',
      defaultsTo: 0
    },

    downs: {
      type: 'integer',
      defaultsTo: 0
    },

    special: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};