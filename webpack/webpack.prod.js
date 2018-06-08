const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextplugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  entry: path.resolve(__dirname, '..', 'src/index.js'),
  module: {
    rules: [
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
  plugins: [
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      minimize: true,
      debug: false,
    }),
  ],
});
