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

    tags: {
      collection: 'tag',
      via: 'name'
    },

    special: {
      type: 'boolean',
      defaultsTo: false
    },
    
    sticky: {
      type: 'boolean',
      defaultsTo: false
    },
    
    nsfw: {
      type: 'boolean',
      defaultsTo: false
    },

    nsfl: {
      type: 'boolean',
      defaultsTo: false
    },

    comments: {
      collection: 'comment',
      via: 'entry'
    },

    commentCount: {
      type: 'integer',
      defaultsTo: 0
    },

    votes: {
      collection: 'vote',
      via: 'entry'
    },

    getScore: function () {
      return this.ups - this.downs;
    },

    toJSON: function toJSON() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  }
};
