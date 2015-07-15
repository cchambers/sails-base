module.exports = {
  attributes: {

    entry: {
        model: 'entry',
    },

    parent: {
        model: 'comment'
    },

    children: {
        collection: 'comment',
        via: 'parent'
    },

    content: {
      type: 'string',
      minLength: 2,
      required: true
    },

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