const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractThemes = new ExtractTextPlugin('theme.css');
const extractLibs = new ExtractTextPlugin('lib.css');

var config = {
  entry: './js/index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },      
      {
        test: /\.css$/,
        //exclude: path.resolve(__dirname, 'css/lib/bootstrap.css'),
        include: [
          path.resolve(__dirname, 'css/lib/'),
        ],
        use: extractLibs.extract(
          {
            fallback: "style-loader",
            use: "css-loader"
          }
        )
      },
      {
        test: /\.css$/,
        //exclude: path.resolve(__dirname, 'css/lib/bootstrap.css'),
        include: [
          path.resolve(__dirname, 'css/theme/'),
        ],
        use: extractThemes.extract(
          {
            fallback: "style-loader",
            use: "css-loader"
          }
        )
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devtool: 'source-map',
  externals: {
    'react': 'React',
    'react-dom' : 'ReactDOM',
    'jquery': 'jQuery',
    'numbro': 'numbro',
    'moment': 'moment',
    'bootstrap': 'bootstrap',
    'socket.io-client': 'io',
    'react-motion': 'react-motion'
  },
  plugins: [
    extractThemes,
    extractLibs
  ],
  output: {
    filename: 'ui-bundle.js'
  }
};

module.exports = function(env) {
  var dir = 'build';

  if (env && env.build)
      dir = env.build;

  config.output.path = path.resolve(__dirname, 'build2', 'js');
  return config;
};