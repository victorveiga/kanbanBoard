const config = require('./config-database')
const Pool   = require('pg').Pool

module.exports = new Pool(config)  