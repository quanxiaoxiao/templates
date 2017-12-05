const ExtractTextplugin = require('extract-text-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const webpack = require('webpack');
const {
  entry,
  output,
  urlLoader,
  jsLoader,
  plugins,
  resolve,
} = require('./webpack.config.js');


module.exports = {
  entry: entry(),
  output: output(),

  module: {
    rules: [
      jsLoader(),
      urlLoader(),

      {
        test: /global\.css$/,
        use: ExtractTextplugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /^((?!global).)*\.css$/,
        use: ExtractTextplugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                sourceMap: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader',
          ],
        }),
      },
    ],
  },

  resolve: resolve(),

  plugins: plugins([
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      minimize: true,
      debug: false,
    }),
    new OptimizeJsPlugin({
      sourceMap: false,
    }),
  ]),
};
