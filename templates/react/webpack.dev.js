const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  entry: [
    path.resolve(__dirname, 'src/index.js'),
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
  ],
  module: {
    rules: [
      {
        test: /global\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
        ],
      },
      {
        test: /^((?!global).)*\.css$/,
        use: [
          'style-loader',
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
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
