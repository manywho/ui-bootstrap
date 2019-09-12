const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');
const WriteBundleFilePlugin = require('./WriteBundleFilePlugin');

const { PACKAGE_VERSION } = process.env;

if (!PACKAGE_VERSION) {
    throw new Error('A version number must be supplied for a production build. eg. 1.0.0');
}

const extractBootstrap = new ExtractTextPlugin(`css/flow-ui-bootstrap-${PACKAGE_VERSION}.css`);
const extractComponentsLess = new ExtractTextPlugin(`css/flow-ui-bootstrap-components-${PACKAGE_VERSION}.css`);

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
                        importLoaders: 1,
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
        filename: 'bootstrap-bundle.json',
        bundleKey: 'bootstrap3',
        pathPrefix: '/',
        // remove sourcemaps and theme css files from the bundle list
        filenameFilter: filename => !filename.endsWith('.map') && !/themes/.test(filename),
    })
]);

const config = Object.assign({}, commonConfig, {
    mode: 'production',
    module: {
        rules,
    },
    plugins
});

config.output.filename = `[name]-${PACKAGE_VERSION}.js`;

module.exports = common.run(config, defaultDirectory);
