const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextplugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    path.resolve(__dirname, 'src/index.js'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /.css$/,
        use: ExtractTextplugin.extract({
          use: [
            'css-loader',
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          'url-loader',
        ],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      minimize: true,
      debug: false,
    }),
  ],
};
