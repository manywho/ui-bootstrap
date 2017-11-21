var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var common = require('./webpack.common.js');

var extractBootstrap = new ExtractTextPlugin('css/mw-bootstrap.css');

var baseConfig = common.config;
var baseRules = common.rules;
var run = common.run;

var rules = baseRules.concat([
    {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
            emitErrors: true,
            failOnHint: true
        },
    },
    { 
        exclude: /node_modules/,
        test: /\.(less)$/,
        include: path.resolve(__dirname, 'css/mw-bootstrap.less'),
        use: extractBootstrap.extract({
            use: [
                { loader: "css-loader" },
                { loader: "less-loader" }
            ],
        })
    }
]);

var plugins = common.plugins.concat([    
    extractBootstrap,
]);

var config = Object.assign({}, baseConfig, {
    module: {
        rules,
    },
    plugins,
    devtool: 'source-map'
});

module.exports = config;