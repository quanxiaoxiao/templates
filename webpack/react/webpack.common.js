const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
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
    publicPath: '/static',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          chunks: 'all',
          test: ({ resource }) => resource && /node_modules\/(react|redux)(?!\w)/.test(resource),
          name: 'react',
          enforce: true,
          priority: 10,
        },
        lib: {
          chunks: 'all',
          test: ({ resource }) => resource && /node_modules\/(moment|lodash)(?!\w)/.test(resource),
          name: 'lib',
          enforce: true,
          priority: 9,
        },
        d3: {
          chunks: 'all',
          test: ({ resource }) => resource && /node_modules\/d3(?!\w)/.test(resource),
          name: 'd3',
          enforce: true,
          priority: 8,
        },
        vendor: {
          chunks: 'all',
          test: ({ resource }) => resource &&
            resource.indexOf(path.join(__dirname, 'node_modules')) === 0,
          name: 'vender',
          enforce: true,
          priority: 5,
        },
      },
    },
    runtimeChunk: true,
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
};
