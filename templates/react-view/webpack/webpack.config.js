const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const output = (other = {}) => ({
  path: path.resolve(__dirname, '..', 'dist'),
  filename: '[name].js',
  publicPath: '/',
  ...other,
});

const entry = (other = {}) => ({
  shim: ['babel-polyfill'],
  react: [
    'react',
    'react-dom',
    'redux',
    'redux-thunk',
  ],
  app: './src/index.js',
  ...other,
});

const jsLoader = (loaders = []) => ({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    ...loaders,
    'babel-loader',
  ],
});

const urlLoader = (loaders = []) => ({
  test: /\.(png|jpe?g|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9])?$/,
  use: [
    ...loaders,
    'url-loader',
  ],
});

const resolve = (other = {}) => ({
  modules: [
    path.resolve(__dirname, '..', 'src'),
    'node_modules',
  ],
  ...other,
});

const plugins = (other = []) => [
  new LodashModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body',
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['react', 'shim'],
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  ...other,
];

module.exports = {
  output,
  entry,
  jsLoader,
  urlLoader,
  plugins,
  resolve,
};
