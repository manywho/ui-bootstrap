var config = require('./webpack.development-base.config');
var common = require('./webpack.common.js');
var dir = 'build';

module.exports = common.run(config, dir);