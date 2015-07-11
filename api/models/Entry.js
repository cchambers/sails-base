/**
* Entry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: {

    },

    title: {
      type: 'string',
      minLength: 2,
      required: true
    },

    media: {
      type: 'string',
      minLength: 2
    },

    content: {
      type: 'string'
    },

    postedTo: [{
      type: 'string'
    }],

    postedBy: {
      type: 'string'
    }


  }
};

