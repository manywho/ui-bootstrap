var developmentConfig = require('./webpack.development-base.config');
var common = require('./webpack.common.js');
var dir = 'build';

var config = Object.assign({}, developmentConfig, {
    watch: true,
    watchOptions: {
        poll: true
    }
});

module.exports = common.run(config, dir);