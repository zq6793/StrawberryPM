var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  type: process.env.type,
  NODE_ENV: '"development"',
  DOMAIN: '"tboss.funxdata.com"',
})
