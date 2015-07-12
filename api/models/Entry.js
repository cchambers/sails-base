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

    postedTo: {
      type: 'string',
      required: true
    },

    crossPostedTo: [{
      type: 'string'
    }],

    postedBy: {
      type: 'string'
    }
  }
};