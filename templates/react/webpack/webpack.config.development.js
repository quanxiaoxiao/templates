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
  devtool: 'inline-source-map',
  entry: entry({ app: ['webpack-hot-middleware/client', './src/index.js'] }),
  output: output(),

  module: {
    rules: [
      jsLoader(),
      urlLoader(),

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

  resolve: resolve(),

  plugins: plugins([
    new webpack.HotModuleReplacementPlugin(),
  ]),
};
