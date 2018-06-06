var webpack = require('webpack');
var merge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var common = require('./webpack.common.js');

module.exports = merge(common, {
  module: {
    rules: [
      {
        // Use this loader for both jpg and png
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/img/'
            }
          }
        ]
      },
    ]
  },
  output: {
    publicPath: '.'
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
  ]
});
