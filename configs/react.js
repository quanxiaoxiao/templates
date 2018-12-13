const path = require('path');
const Handlebars = require('handlebars');
const shelljs = require('shelljs');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'react/:name': ({ query, params }) => ({
    from: path.join(templatesDir, 'react'),
    exclude: query.type === 'view' ? [/containers/] : [],
    handleContent: content => Handlebars.compile(content)({
      view: query.type === 'view',
      name: params.name,
      ...query,
    }),
    to: path.join(params.name, 'src'),
    next: () => {
      process.chdir(params.name);
      shelljs.exec(`tpl get "configs?type=react&name=${params.name}"`);
      shelljs.exec('tpl get webpack?type=react');
      if (query.type === 'view') {
        shelljs.exec('tpl get react/scene/View');
        shelljs.exec('tpl get react/scene/Home');
        shelljs.exec('tpl get rootReducer?type=view');
      } else {
        shelljs.exec('tpl get reducer/main');
      }
      const dependencies = [
        '@babel/polyfill',
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
        'whatwg-fetch',
      ];
      const devDependencies = [
        '@babel/core',
        '@babel/preset-env',
        '@babel/runtime',
        '@babel/preset-react',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-transform-runtime',
        'autoprefixer',
        'babel-loader',
        'css-loader',
        'extract-text-webpack-plugin@next',
        'html-webpack-plugin',
        'postcss-calc',
        'postcss-color-function',
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
      if (query.type === 'view') {
        dependencies.push('react-router-dom');
        dependencies.push('react-router-redux@next');
        dependencies.push('history');
        dependencies.push('qs');
      }
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  }),
};
