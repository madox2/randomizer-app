const path = require('path')
const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')

/* to exclude module from node_modules: */
//exclude: /node_modules\/(?!(some-module|other-module)\/).*/,

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
  entry: [
    path.join(__dirname, './index.web.js'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { cacheDirectory: true },
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: 'url-loader',
        query: { name: '[name].[hash:16].[ext]' },
      },
    ],
  },
  output: {
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new DashboardPlugin({ port: 3001  }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-popup-menu': path.join(__dirname, './web/react-native-popup-menu'),
    },
  },
}
