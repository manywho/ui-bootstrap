var path = require('path');
var fs = require( 'fs' );
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractComponentsLess = new ExtractTextPlugin('css/ui-bootstrap.css');

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
        use: extractComponentsLess.extract([ 'css-loader', 'less-loader' ])
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
    extractComponentsLess
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