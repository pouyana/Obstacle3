var config = {
  log4js: {
    appenders: [{
      type: 'console',
      layout: {
        type: "basic"
      }
    }]
  },
  http: {
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0'
  },
  mongodb: {
    url: 'mongodb://172.17.68.6:27017/test',
    config: {
      config: {
        autoIndex: false
      }
    }
  }
}
module.exports = config
