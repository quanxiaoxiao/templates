const Handlebars = require('handlebars');
const shelljs = require('shelljs');
const fs = require('fs');
const qs = require('querystring');
const _ = require('lodash');
const path = require('path');

module.exports = {
  components: () => ({
    from: path.resolve(__dirname, 'storybook/src/components'),
    include: [
      /^DatePicker/,
      /^Layout/,
      /^Slider/,
    ],
    to: 'src/components',
    after: (type) => {
      if (type === 'create') {
        shelljs.exec('npm install moment');
      }
    },
  }),
  configs: (ctx) => {
    const include = [
      /\.gitignore$/,
      /\.editorconfig$/,
    ];
    if (ctx.query.type === 'react') {
      include.push(/\.react_eslintrc$/);
      include.push(/package\.json$/);
      include.push(/norice\.config\.js$/);
      include.push(/postcss\.config\.js/);
      include.push(/\.babelrc$/);
    } else {
      include.push(/\.eslintrc$/);
    }
    return {
      from: path.resolve(__dirname, 'config'),
      handlePathName: a => a.replace(/react_/, ''),
      handleContent: content => Handlebars.compile(content)(ctx.query),
      include,
      to: '',
    };
  },
  webpack: () => ({
    from: path.resolve(__dirname, 'webpack'),
    to: 'webpack',
  }),

  'react/view/:name': ctx => ({
    from: path.resolve(__dirname, 'react-view', ctx.params.name === 'View' ? 'View' : 'Page'),
    exclude: [/\.swp$/],
    handleContent: content => Handlebars.compile(content)({ name: ctx.params.name }),
    to: `src/scenes/${ctx.params.name}`,
  }),
  'react/:name': ctx => ({
    from: path.resolve(__dirname, 'react'),
    exclude: ctx.query.type === 'view' ? [/containers/] : [],
    handleContent: content => Handlebars.compile(content)({
      view: ctx.query.type === 'view',
      name: ctx.params.name,
      ...ctx.query,
    }),
    to: `${ctx.params.name}/src`,
    after: () => {
      process.chdir(ctx.params.name);
      shelljs.exec(`temp2 create "configs?type=react&name=${ctx.params.name}"`);
      shelljs.exec('temp2 create webpack');
      shelljs.exec('temp2 create components');
      if (ctx.query.type === 'view') {
        shelljs.exec('temp2 create "react/view/View"');
      }
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
        'babel-plugin-transform-runtime',
      ];
      if (ctx.query.type === 'view') {
        dependencies.push('react-router-dom');
        dependencies.push('react-router-redux@next');
        dependencies.push('history');
        dependencies.push('qs');
      }
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  }),
  'storybook/:name': ctx => ({
    from: path.resolve(__dirname, 'storybook'),
    exclude: [/node_modules/, /\.swp$/, /package-lock\.json/],
    to: `${ctx.params.name}`,
  }),
  'component/:name': (ctx) => {
    const exclude = [];
    let to = `src/components/${ctx.params.name}`;
    if (ctx.query.name) {
      exclude.push(/index\.js$/);
    }
    if (ctx.query.scene) {
      to = `src/scenes/${ctx.query.scene}/components/${ctx.params.name}`;
    }
    return {
      from: path.resolve(__dirname, 'components'),
      exclude,
      handlePathName: name => name.replace(/__name__(?=\.)/, ctx.query.name || ctx.params.name),
      handleContent: content => Handlebars.compile(content)({ name: ctx.params.name }),
      to,
    };
  },
  'reducer/:name': ctx => ({
    from: path.resolve(__dirname, 'reducer/reducer.js'),
    handlePathName: name => (ctx.query.scene ? name : `${ctx.params.name}.js`),
    to: ctx.query.scene ?
      `src/scenes/${ctx.query.scene}/data/${ctx.params.name}` :
      'src/reducers',
    after: () => {
      const query = {
        list: ctx.query.scene ?
          fs.readdirSync(`src/scenes/${ctx.query.scene}/data`) :
          fs.readdirSync('src/reducers')
            .filter(a => a !== 'index.js' && !/\.swp$/.test(a))
            .map(a => path.basename(a, '.js')),
        scene: ctx.query.scene,
      };
      shelljs.exec(`temp2 update 'rootReducer?${qs.stringify(query)}'`);
    },
  }),
  rootReducer: ctx => ({
    from: path.resolve(__dirname, 'reducer/rootReducer.js'),
    handlePathName: () => (ctx.query.scene ? 'reducer.js' : 'index.js'),
    handleContent: content => Handlebars.compile(content)({
      scene: ctx.query.scene,
      list: (Array.isArray(ctx.query.list) ? // eslint-disable-line
        ctx.query.list : _.isEmpty(ctx.query.list) ? [] : [ctx.query.list]).map(a => ({
        reducer: a,
      })),
    }),
    to: ctx.query.scene ? `src/scenes/${ctx.query.scene}` : 'src/reducers',
  }),
  'action/:name': ctx => ({
    from: path.resolve(__dirname, 'reducer/actions.js'),
    handleContent: content => Handlebars.compile(content)({
      name: ctx.params.name,
      scene: ctx.query.scene,
      action: ctx.query.action,
      actionType: ctx.query.action.replace(/(.+?)(?=[A-Z])/g, a => `${a}_`).toUpperCase(),
    }),
    to: ctx.query.scene ?
      `src/scenes/${ctx.query.scene}/data/${ctx.params.name}` :
      'src/actions',
  }),
};
