var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


var extractPlugin = new ExtractTextPlugin({
   filename: 'main.css'
});
// This is a js file, import first then export.

// This is a javascript object, know the syntax (comas, arrays, etc)
module.exports = {
  // Where webpack starts analyzing the project (relative path from the config)
  // You can have multiple entry points
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
    // The path module helps you write absolute paths easier
    path: path.resolve(__dirname, 'dist'),
    filename:  'bundle.js',
    publicPath: '/'
  },
  // resolve module
  resolve: {
    alias: {
      EventBusAlias$: path.resolve(__dirname, 'src', 'js', 'components', 'event-bus.js'),
      Store$: path.resolve(__dirname, 'src', 'js', 'stores', 'AppStore.js'),
      Action$: path.resolve(__dirname, 'src', 'js', 'actions', 'AppActions.js'),
      Params$: path.resolve(__dirname, 'src', 'js', 'params.js'),
      Style$: path.resolve(__dirname, 'src', 'css'),
      Lib: path.resolve(__dirname, 'src', 'js', 'lib'),
      Audio: path.resolve(__dirname, 'src', 'audio'),
      Img: path.resolve(__dirname, 'src', 'img'),
      Vendor: path.resolve(__dirname, 'src', 'vendor')
    },
  },
  // Modules are applied to single files before bundling
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        // Use this loader for both jpg and png
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // Dont't let file-loader use hashes (Personal opinion)
              name: '[name].[ext]',
              // Store the images in a separate folder (Personal opinion)
              outputPath: 'img/',
              // Put img/imageName in the html reference in the index.html
              publicPath: '/'
            }
          }
        ]
      },
      {
        test: /\.otf$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 50000,
          },
        },
      }
    ]
  },
  // Plugins are applied to the bundled code before exporting
  // f.e. a minifier (but webpack already does that)
  plugins: [

    new webpack.ProvidePlugin({
      _: 'lodash',
      Pubsub: 'pubsub-js',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    // Always instiate (new) plugins and import them
    // You can do both at the beggining and then reference the var
    extractPlugin,
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // This will clean the dist folder before building, so all files are fresh and new
    new CleanWebpackPlugin(['dist']),
    new FaviconsWebpackPlugin({
      logo: './src/img/DAppNodeFavicon.png',
      inject: true,
      prefix: 'img/icons/',
    }),
  ]
}
