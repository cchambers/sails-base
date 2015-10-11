module.exports.connections = {
  local: {
    adapter: 'sails-disk'
  },

  mongodb: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    user: 'site',
    password: '#YQLnjz#5Kv2',
    database: 'gravy'
  },

  mongotestdb: {
    adapter: 'sails-mongo',
    host: 'ds031193.mongolab.com',
    port: 31193,
    user: 'site',
    password: 'tyFZ6G6k',
    database: 'gravytesting'
  }
};