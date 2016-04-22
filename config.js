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
  }
}
module.exports = config
