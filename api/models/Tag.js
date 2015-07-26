// many to many relationship with entries
module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },

    coinedBy: {
      model: 'name'
    },

    timesUsed: {
      type: 'integer',
      defaultsTo: 1
    },

   
  }
};

