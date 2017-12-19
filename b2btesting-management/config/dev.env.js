var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOTURL: '"http://211.157.179.220:8866/"',
  ROOTURL1: '"http://211.157.179.220:9999/"'
})
