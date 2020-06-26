const path = require('path');
const fs = require('fs');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pathsToClean = [
    'dist',
    'build',
];

const themeDir = path.resolve(__dirname, 'css/themes/');
const publicPaths = {
    LOCAL: 'http://localhost:3000/build/',
    DEVELOPMENT: 'https://manywho-ui-development.s3.eu-west-2.amazonaws.com/',
    QA: 'https://s3.amazonaws.com/manywho-cdn-react-qa/',
    STAGING: 'https://s3.amazonaws.com/manywho-cdn-react-staging/',
    PRODUCTION: 'https://assets.manywho.com/',
};

const mapPublicPath = (assets, publicPaths) => {

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

    default:
        return publicPaths.PRODUCTION;
    }
};

module.exports.config = {
    entry: {
        'js/flow-ui-bootstrap': './js/index.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        jquery: 'jQuery',
        numbro: 'numbro',
        moment: 'moment',
        bootstrap: 'bootstrap',
        'socket.io-client': 'io',
    },
    output: {
        // Properties added for different environments
    },
    performance: {
        hints: 'warning',
        assetFilter(assetFilename) {
            return assetFilename.endsWith('.js');
        },
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
    },
};

module.exports.plugins = [
    new LicenseWebpackPlugin({
        pattern: /.*/,
        unacceptablePattern: /GPL|MPL|CC|EPL|CDDL|Artistic|OFL|Ms-RL|BSL|AFL|APSL|FDL|CPOL|AML|IPL|W3C|QPL/gi,
        abortOnUnacceptableLicense: true,
    }),
    new CleanWebpackPlugin(pathsToClean),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
];

module.exports.rules = [
    {
        test: /\.css$/,
        include: [/node_modules\/tinymce\//, /node_modules\\tinymce\\/],
        use: ['style-loader', 'css-loader'],
    },
    {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
    },
    {
        test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=css/fonts',
    },
    {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=img',
    },
    {
        test: /themes.*\.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
        ],
    },
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
    'css/historical-navigation.less',
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
    'css/image.less',
];

module.exports.run = (config, defaultDirectory) => (env = {}) => {

    const publicPath = mapPublicPath(env.assets, publicPaths);
    const outputPath = env && env.build ? env.build : defaultDirectory;
    const watch = env && env.watch;
    const analyze = env && env.analyze;
    const sourcemaps = !((env && env.sourcemaps === false)); // default to true unless explicitly set to false

    console.log('Build directory: ', outputPath);
    console.log('Assets url: ', publicPath);

    return new Promise((resolve) => {

        fs.readdir(themeDir, (err, files) => {

            // Check for every theme in the themes folder
            files.forEach((filename) => {

                // We are only interested in LESS files
                if (filename.includes('less')) {

                    const filenameWithoutExtension = filename.split('.')[0];

                    // add an entry for each theme
                    // this will then output a separate file for each
                    // eg. config.entry['css/themes/mw-cerulean'] = './css/themes/mw-cerulean.less'
                    config.entry[`css/themes/${filenameWithoutExtension}`] = `./css/themes/${filename}`;

                }
            });

            if (watch) {
                config.watch = true;
                config.watchOptions = {
                    poll: true,
                };
            }

            if (analyze) {
                config.plugins = config.plugins.concat([
                    new BundleAnalyzerPlugin(),
                ]);
            }

            config.devtool = sourcemaps ? 'source-map' : 'none';

            config.output.publicPath = publicPath;

            config.output.path = path.resolve(__dirname, outputPath);
            return resolve(config);
        });

    });
};
