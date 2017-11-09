var path = require('path');
var fs = require( 'fs' );
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractLibs = new ExtractTextPlugin('lib.css');

var themeDir = path.resolve(__dirname, 'css/themes/');

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
        test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },      
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'css/lib/'),
        ],
        use: extractLibs.extract(
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
    extractLibs
  ],
  output: {
    filename: 'js/ui-bundle.js'
  }
};

const configPromise = new Promise(function(resolve, reject) {
  
  fs.readdir(themeDir, function(err, files) {
    files.forEach(function(file, index) {
      if(file.includes('less')) {
        fileName = file.split('.')[0];
        extractInstance = new ExtractTextPlugin('css/themes/' + fileName + '.css');
        ruleObj = {
          test: /\.less$/,
          include: path.resolve(__dirname, 'css/themes/' + file),
          use: extractInstance.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }],
          })
        };
        
        config.module.rules.push(ruleObj);
        config.plugins.push(extractInstance);
      }
    });

    config.output.path = path.resolve(__dirname, 'build2');
    return resolve(config);
  })
  
})
  
module.exports = configPromise