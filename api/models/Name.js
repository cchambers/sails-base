module.exports = {
  attributes: {
    user: {
      model: 'user'
    },
    
    name: {
      type: 'string',
      required: true,
      unique: true 
    },
    
    votes: {
      collection: 'vote',
      via: 'name'
    },
    
    entries: {
      collection: 'entry',
      via: 'postedBy'
    },

    conversations: {
      collection: 'message',
      via: 'from'
    },
    
    comments: {
      collection: 'comment',
      via: 'postedBy'
    },
    
    active: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

