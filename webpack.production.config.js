var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var common = require('./webpack.common.js');

var extractBootstrap = new ExtractTextPlugin('css/mw-bootstrap.css');

var baseConfig = common.config;
var baseRules = common.rules;
var run = common.run;
var dir = 'dist';

var rules = [
    {
        test: /\.(less)$/,
        include: path.resolve(__dirname, 'css/mw-bootstrap.less'),
        use: extractBootstrap.extract({
            use: [
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: true,
                        minimize: true
                    }
                },
                { loader: "less-loader" }
            ],
        })
    }
];

var plugins = common.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        DEBUG: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractBootstrap,
]);

var config = Object.assign({}, baseConfig, {
    module: {
        rules: baseRules.concat(rules),
    },
    plugins,
    devtool: 'none'
});

module.exports = common.run(config, dir);