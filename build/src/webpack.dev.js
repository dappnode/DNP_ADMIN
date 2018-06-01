var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        // Use this loader for both jpg and png
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
    ]
  },
  // , plugins: [
  //   // #### Don't keep this uncommented
  //   new BundleAnalyzerPlugin()
  // ]
});
