var webpack = require('webpack');
var merge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    publicPath: '.'
  },  
  plugins: [
    new UglifyJSPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
  ]
});
