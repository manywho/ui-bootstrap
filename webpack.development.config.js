const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = require('./webpack.common.js');

const extractBootstrap = new ExtractTextPlugin('css/flow-ui-bootstrap.css');
const extractComponentsLess = new ExtractTextPlugin('css/flow-ui-bootstrap-components.css');

const commonConfig = common.config;
const commonRules = common.rules;
const commonPlugins = common.plugins;
const run = common.run;
const defaultDirectory = 'build';

const rules = commonRules.concat([
    {
        exclude: /node_modules/,
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
                { loader: "css-loader" },
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
    extractBootstrap,
    extractComponentsLess
]);

const config = Object.assign({}, commonConfig, {
    mode: 'development',
    module: {
        rules,
    },
    plugins
});

config.output.filename = '[name].js';

module.exports = common.run(config, defaultDirectory);