module.exports.connections = {
  local: {
    adapter: 'sails-disk'
  },

  mongodb: {
    adapter: 'sails-mongo',
    host: 'ds045882.mongolab.com',
    port: 45882,
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