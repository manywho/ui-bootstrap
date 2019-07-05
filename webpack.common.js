const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const pathsToClean = [
    'dist',
    'build'
];

const themeDir = path.resolve(__dirname, 'css/themes/');
const publicPaths = {
    LOCAL: 'http://localhost:3000/build/',
    DEVELOPMENT: 'https://manywho-ui-development.s3.eu-west-2.amazonaws.com/',
    QA: 'https://s3.amazonaws.com/manywho-cdn-react-qa/',
    STAGING: 'https://s3.amazonaws.com/manywho-cdn-react-staging/',
    PRODUCTION: 'https://assets.manywho.com/',
	END2END: 'http://localhost:9000/flow/'
}

const mapPublicPath = (assets, publicPaths) => {

    const assetsKey = typeof assets === 'string' ? assets.toLocaleLowerCase() : null;

    switch (assets) {

        case 'local':
            return publicPaths.LOCAL;

        case 'development':
            return publicPaths.DEVELOPMENT;

        case 'qa':
            return publicPaths.QA;

        case 'staging':
            return publicPaths.STAGING;

        case 'production':
            return publicPaths.PRODUCTION;
			
		case 'end2end':
			return publicPaths.END2END;

        default:
            return publicPaths.PRODUCTION;
    }
}

module.exports.config = {
    entry: './js/index.js',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'jquery': 'jQuery',
        'numbro': 'numbro',
        'moment': 'moment',
        'bootstrap': 'bootstrap',
        'socket.io-client': 'io',
    },
    output: {
        // Properties added for different environments
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

module.exports.plugins = [
    new LicenseWebpackPlugin({
        pattern: /.*/,
        unacceptablePattern: /GPL|MPL|CC|EPL|CDDL|Artistic|OFL|Ms-RL|BSL|AFL|APSL|FDL|CPOL|AML|IPL|W3C|QPL/gi,
        abortOnUnacceptableLicense: true
    }),
    new CleanWebpackPlugin(pathsToClean),
];

module.exports.rules = [
    {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
    },
    {
        test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
        use: 'file-loader?name=[path][name].[ext]'
    },
    {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader?name=[path][name].[ext]'
    }
];

module.exports.cssPaths = [
    'css/lib/bootstrap-datetimepicker.css',
    'css/lib/react-selectize.css',
    'css/chart.less',
    'css/containers.less',
    'css/content.less',
    'css/debug.less',
    'css/feed.less',
    'css/files.less',
    'css/flip.less',
    'css/footer.less',
    'css/group.less',
    'css/history.less',
    'css/iframe.less',
    'css/input.less',
    'css/items.less',
    'css/list.less',
    'css/loading.less',
    'css/modal.less',
    'css/navigation.less',
    'css/notifications.less',
    'css/outcome.less',
    'css/outcomes.less',
    'css/pagination.less',
    'css/radio.less',
    'css/returnToParent.less',
    'css/select.less',
    'css/status.less',
    'css/table.less',
    'css/textarea.less',
    'css/tiles.less',
    'css/toggle.less',
    'css/tours.less',
];

module.exports.run = (config, defaultDirectory) => (env = {}) => {

    const publicPath = mapPublicPath(env.assets, publicPaths);
    const outputPath = env && env.build ? env.build : defaultDirectory;
    const watch = env && env.watch;
    const analyze = env && env.analyze;
    const sourcemaps = (env && env.sourcemaps === false) ? false : true; // default to true unless explicitly set to false

    console.log('Build directory: ', outputPath)
    console.log('Assets url: ', publicPath);

    return new Promise((resolve, reject) => {

        fs.readdir(themeDir, (err, files) => {

            // Check for every theme in the themes folder
            files.forEach((file, index) => {

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

            if (watch) {
                config.watch = true
                config.watchOptions = {
                    poll: true
                };
            }

            if (analyze) {
                config.plugins = config.plugins.concat([
                    new BundleAnalyzerPlugin()
                ]);
            }

            config.devtool = sourcemaps ? 'source-map' : 'none';
            
            config.output.publicPath = publicPath;

            config.output.path = path.resolve(__dirname, outputPath);
            return resolve(config);
        });

    });
};