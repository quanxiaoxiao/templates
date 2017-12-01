const path = require('path');
const shelljs = require('shelljs');

const component = {
  from: path.resolve(__dirname, './templates/react-component'),
  flag: 'component',
  to: 'src/components/_',
};

module.exports = {
  default: component,

  component,

  container: {
    from: path.resolve(__dirname, './templates/react-container'),
    flag: 'container',
    to: 'src/containers/_',
  },

  reducer: {
    from: path.resolve(__dirname, './templates/reducer/__reducer__.js'),
    flag: 'reducer',
    to: 'src/reducers',
  },

  react: {
    from: path.resolve(__dirname, './templates/react'),
    to: '_',
    post: ({ name }) => {
      shelljs.cd(name);
      const dependencies = [
        'babel-polyfill',
        'classnames',
        'lodash',
        'normalize.css',
        'prop-types',
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'redux-promise',
        'redux-thunk',
      ];
      const devDependencies = [
        'autoprefixer',
        'babel-core',
        'babel-loader',
        'babel-plugin-transform-runtime',
        'babel-preset-env',
        'babel-preset-react',
        'babel-preset-react-hmre',
        'babel-preset-stage-0',
        'cross-env',
        'css-loader',
        'extract-text-webpack-plugin',
        'file-loader',
        'html-webpack-plugin',
        'lodash-webpack-plugin',
        'node-sass',
        'postcss-loader',
        'redux-logger',
        'rimraf',
        'sass-loader',
        'style-loader',
        'url-loader',
        'webpack',
        'webpack-hot-middleware',
      ];
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  },

  config: {
    from: path.resolve(__dirname, './templates/config'),
    to: '.',
  },
};
