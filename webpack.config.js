var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var extractComponentsLess = new ExtractTextPlugin('css/ui-bootstrap.css');
var extractBootstrap = new ExtractTextPlugin('css/mw-bootstrap.css');

var themeDir = path.resolve(__dirname, 'css/themes/');

var config = {
    entry: './js/index.js',
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
                use: 'file-loader?name=[path][name].[ext]'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader?name=[path][name].[ext]'
            },
            {
                test: /\.(less)$/,
                include: path.resolve(__dirname, 'css/mw-bootstrap.less'),
                use: extractBootstrap.extract({
                    use: [
                        { loader: "css-loader" },
                        { loader: "less-loader" }
                    ],
                })
            },
            {
                test: /\.(less|css)$/,
                include: [
                    path.resolve(__dirname, 'css/lib/bootstrap-datetimepicker.css'),
                    path.resolve(__dirname, 'css/lib/jquery.textcomplete.css'),
                    path.resolve(__dirname, 'css/lib/react-selectize.css'),
                    path.resolve(__dirname, 'css/chart.less'),
                    path.resolve(__dirname, 'css/containers.less'),
                    path.resolve(__dirname, 'css/content.less'),
                    path.resolve(__dirname, 'css/debug.less'),
                    path.resolve(__dirname, 'css/feed.less'),
                    path.resolve(__dirname, 'css/files.less'),
                    path.resolve(__dirname, 'css/flip.less'),
                    path.resolve(__dirname, 'css/footer.less'),
                    path.resolve(__dirname, 'css/group.less'),
                    path.resolve(__dirname, 'css/history.less'),
                    path.resolve(__dirname, 'css/iframe.less'),
                    path.resolve(__dirname, 'css/input.less'),
                    path.resolve(__dirname, 'css/items.less'),
                    path.resolve(__dirname, 'css/list.less'),
                    path.resolve(__dirname, 'css/loading.less'),
                    path.resolve(__dirname, 'css/modal.less'),
                    path.resolve(__dirname, 'css/navigation.less'),
                    path.resolve(__dirname, 'css/notifications.less'),
                    path.resolve(__dirname, 'css/outcome.less'),
                    path.resolve(__dirname, 'css/outcomes.less'),
                    path.resolve(__dirname, 'css/pagination.less'),
                    path.resolve(__dirname, 'css/radio.less'),
                    path.resolve(__dirname, 'css/returnToParent.less'),
                    path.resolve(__dirname, 'css/select.less'),
                    path.resolve(__dirname, 'css/status.less'),
                    path.resolve(__dirname, 'css/table.less'),
                    path.resolve(__dirname, 'css/textarea.less'),
                    path.resolve(__dirname, 'css/tiles.less'),
                    path.resolve(__dirname, 'css/toggle.less'),
                    path.resolve(__dirname, 'css/tours.less'),
                ],
                use: extractComponentsLess.extract(['css-loader', 'less-loader'])
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'source-map',
    watch: true,
    watchOptions: {
        poll: true
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'jquery': 'jQuery',
        'numbro': 'numbro',
        'moment': 'moment',
        'bootstrap': 'bootstrap',
        'socket.io-client': 'io',
        'react-motion': 'react-motion'
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        extractBootstrap,
        extractComponentsLess
    ],
    output: {
        filename: 'js/ui-bootstrap.js',
    },
    performance: {
        hints: "warning",
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    stats: {
        // Add asset Information
        assets: false,
        // Add children information
        children: false,
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,
        // `webpack --colors` equivalent
        colors: true,
        // Add errors
        errors: true,
        // Set the maximum number of modules to be shown
        maxModules: 15,
        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: true,
        // Add warnings
        warnings: true,
    }
};

module.exports = function (env) {
    var dir = 'build';
    var publicPath = "http://localhost:3000/build/"

    return new Promise(function (resolve, reject) {

        fs.readdir(themeDir, function (err, files) {

            // Check for every theme in the themes folder
            files.forEach(function (file, index) {

                // We are only interested in LESS files
                if (file.includes('less')) {
                    fileName = file.split('.')[0];
                    extractInstance = new ExtractTextPlugin('css/themes/' + fileName + '.css');
                    ruleObj = {
                        test: /\.less$/,
                        include: path.resolve(__dirname, 'css/themes/' + file),
                        use: extractInstance.extract({
                            use: [
                                { loader: "css-loader" },
                                { loader: "less-loader" }
                            ],
                        })
                    };

                    // Adding a rule for every theme
                    config.module.rules.push(ruleObj);

                    // Adding a plugin for every theme
                    config.plugins.push(extractInstance);
                }
            });

            if (env && env.build)
                dir = env.build;
            config.output.publicPath = publicPath;

            config.output.path = path.resolve(__dirname, dir);
            return resolve(config);
        })

    })
};