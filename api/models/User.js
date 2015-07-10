var bcrypt = require('bcrypt');

module.exports = {
    attributes: {
        email: {
            type: 'email',
            required: true,
            unique: true
        },

        password: {
            type: 'string',
            minLength: 6,
            required: true
        },

        username: {
            type: 'string',
            minLength: 3,
            required: true,
            unique: true
        },

        online: {
          type: 'boolean',
          defaultsTo: false
        },

        admin: {
          type: 'boolean',
          defaultsTo: false
        },

        verified: {
          type: 'boolean',
          defaultsTo: false
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }
};