const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');
const filename = 'js/ui-bootstrap-[chunkhash].js';
const WriteBundleFilePlugin = require('./WriteBundleFilePlugin');
const Compression = require('compression-webpack-plugin');

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
                    // After less has run, change instances of .mw-bs html and .mw-bs body to .mw-bs
                    // This is caused by nesting the entire bootstrap.css file within mw-bootstrap.less
                    loader: 'string-replace-loader',
                    options: {
                        search: '\.mw-bs html|\.mw-bs body', 
                        replace: '.mw-bs', 
                        flags: 'g' ,
                    }
                },
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
        },
        sourceMap: true,
        minimize: true
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
    extractComponentsLess,
    new WriteBundleFilePlugin({
        bundleKey: 'bootstrap3',
        pathPrefix: '/',
        // remove sourcemaps and theme css files from the bundle list
        filenameFilter: filename => !filename.endsWith('.map') && !/themes/.test(filename),
    }),
    new Compression({
        asset: '[path]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.svg$/,
        threshold: 10240,
        minRatio: 0.8,
    }),
]);

const config = Object.assign({}, commonConfig, {
    module: {
        rules,
    },
    plugins
});

config.output.filename = filename;

module.exports = common.run(config, defaultDirectory);