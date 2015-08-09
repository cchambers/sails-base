module.exports = {
  attributes: {
    entry: {
      model: 'entry'
    },
    
    root: {
      model: 'comment'
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
      model: 'name'
    },

    user: {
      model: 'user'
    },

    ups: {
      type: 'integer',
      defaultsTo: 0
    },

    downs: {
      type: 'integer',
      defaultsTo: 0
    },

    tags: {
      collection: 'tag',
      via: 'name'
    },

    special: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
