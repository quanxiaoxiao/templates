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
    '/view': {
      from: path.resolve(__dirname, './templates/react-view'),
      to: '_',
    },
    post: ({ name, flag }) => {
      shelljs.cd(name);
      const dependencies = [
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
        'babel-core',
        'babel-loader',
        'babel-preset-env',
        'babel-preset-react',
        'babel-preset-stage-0',
        'css-loader',
        'extract-text-webpack-plugin@next',
        'html-webpack-plugin',
        'postcss-css-variables',
        'postcss-loader',
        'postcss-nested',
        'redux-logger',
        'style-loader',
        'url-loader',
        'react-hot-loader',
        'webpack',
        'webpack-cli',
        'webpack-hot-middleware',
        'webpack-merge',
      ];
      if (flag === '/view') {
        dependencies.push('react-router-dom');
        dependencies.push('react-router-redux@next');
        dependencies.push('history');
        dependencies.push('qs');
      }
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  },

  config: {
    from: path.resolve(__dirname, './templates/config'),
  },

};
