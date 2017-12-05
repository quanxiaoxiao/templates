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
    '/quan': {
      from: path.resolve(__dirname, './templates/react-container'),
      to: 'src/aaa',
    },
    '/rice': 'src/rice',
    flag: 'reducer',
    to: 'src/reducers',
  },

  react: {
    from: path.resolve(__dirname, './templates/react'),
    to: '_',
    '/view': {
      from: path.resolve(__dirname, './templates/react-view'),
      to: '_',
    },
    post: ({ name, flag }) => {
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
        'optimize-js-plugin',
        'postcss-css-variables',
        'postcss-loader',
        'postcss-nested',
        'redux-logger',
        'rimraf',
        'style-loader',
        'url-loader',
        'webpack',
        'webpack-hot-middleware',
      ];
      if (flag === '/view') {
        dependencies.push('react-router-dom');
      }
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  },

  config: {
    from: path.resolve(__dirname, './templates/config'),
  },

};
