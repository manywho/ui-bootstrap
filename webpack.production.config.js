const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');
const filename = 'js/ui-bootstrap-[chunkhash].js';

const extractBootstrap = new ExtractTextPlugin('css/mw-bootstrap-[contenthash].css');
const extractComponentsLess = new ExtractTextPlugin('css/ui-bootstrap-[contenthash].css');

const commonConfig = common.config;
const commonRules = common.rules;
const commonPlugins = common.plugins;
const run = common.run;
const defaultDirectory = 'dist';

const rules = commonRules.concat([
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
    },
    {
        test: /\.(less|css)$/,
        include: common.cssPaths.map(cssPath => path.resolve(__dirname, cssPath)),
        use: extractComponentsLess.extract(['css-loader', 'less-loader'])
    }
]);

const plugins = commonPlugins.concat([
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
    extractComponentsLess
]);

const config = Object.assign({}, commonConfig, {
    module: {
        rules,
    },
    plugins,
    devtool: 'none'
});

config.output.filename = filename;

module.exports = common.run(config, defaultDirectory);