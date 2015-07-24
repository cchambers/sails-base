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
      model: 'sub'
    },

    crossPostedTo: [{
      type: 'string'
    }],

    postedBy: {
      model: 'name',
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

    special: {
      type: 'boolean',
      defaultsTo: false
    },

    comments: {
      collection: 'comment',
      via: 'entry'
    },

    votes: {
      collection: 'vote',
      via: 'entry'
    },

    getScore: function () {
      return this.ups - this.downs;
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  }
};
