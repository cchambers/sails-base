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
      model: 'user'
    },

    ups: {
      type: 'array'
    },

    downs: {
      type: 'array'
    },

    special: {
      type: 'boolean',
      defaultsTo: false
    },

    comments: {
        collection: 'comment',
        via: 'entry'
    },

    score: function() {
      return this.ups - this.downs;
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  }
};
