/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    from: {
      model: 'name',
      required: true
    },

    to: {
      model: 'name',
      required: true
    },

    participants: {
      collection: 'name',
      via: 'conversations'
    },
    
    message: {
      type: 'string',
      required: true
    },

    root: {
      model: 'message',
      required: true
    },

    parent: {
      model: 'message'
    },

    read: {
      type: 'boolean',
      defaultsTo: false
    }
    
  }
};

