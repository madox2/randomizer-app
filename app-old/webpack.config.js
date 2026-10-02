const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.web.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(@react-native-community\/async-storage)\/).*/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[contenthash]',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/privacy.html',
      filename: './privacy.html',
      inject: false,
    }),
    new HtmlWebPackPlugin({
      template: './src/terms.html',
      filename: './terms.html',
      inject: false,
    }),
  ],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-popup-menu': path.join(
        __dirname,
        './web/react-native-popup-menu',
      ),
    },
  },
}
