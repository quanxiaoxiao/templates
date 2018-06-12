const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const Handlebars = require('handlebars');
const _ = require('lodash');

const command = require('./lib/command');

module.exports = {
  'component/:name': ({ params, query }, cb) => {
    const exclude = [];
    let to = `src/components/${params.name}`;
    if (query.name) {
      exclude.push(/index\.js$/);
    }
    if (query.scene) {
      to = `src/scenes/${query.scene}/components/${params.name}`;
    }
    cb({
      from: path.resolve(__dirname, 'components'),
      handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
      exclude,
      handleContent: content => Handlebars.compile(content)({
        name: query.name || params.name,
      }),
      to,
    });
  },
  components: (ctx, cb) => {
    cb({
      from: path.resolve(__dirname, 'storybook/src/components'),
      include: [
        /^DatePicker/,
        /^Layout/,
        /^Slider/,
      ],
      to: 'src/components',
      complete: (type) => {
        if (type === 'create') {
          command('npm install moment');
        }
      },
    });
  },
  configs: ({ query }, cb) => {
    const include = [
      /\.gitignore$/,
      /\.editorconfig$/,
    ];
    if (query.type === 'react') {
      include.push(/\.react_eslintrc$/);
      include.push(/norice\.config\.js$/);
      include.push(/postcss\.config\.js/);
      include.push(/\.babelrc$/);
    } else {
      include.push(/\.eslintrc$/);
    }
    cb({
      from: path.resolve(__dirname, 'config'),
      handlePathName: a => a.replace(/react_/, ''),
      handleContent: content => Handlebars.compile(content)(query),
      include,
      to: '',
    });
  },
  webpack: (ctx, cb) => {
    cb({
      from: path.resolve(__dirname, 'webpack'),
      to: 'webpack',
    });
  },
  'package/react': ({ query }, cb) => {
    cb({
      from: path.resolve(__dirname, 'config/package.json'),
      handleContent: content => Handlebars.compile(content)({ name: query.name }),
      to: '',
    });
  },
  'react/view/:name': ({ params }, cb) => {
    cb({
      from: path.resolve(__dirname, 'react-view', params.name === 'View' ? 'View' : 'Page'),
      exclude: [/\.swp$/],
      handleContent: content => Handlebars.compile(content)({ name: params.name }),
      to: `src/scenes/${params.name}`,
    });
  },
  'react/:name': ({ query, params }, cb) => {
    cb({
      from: path.resolve(__dirname, 'react'),
      exclude: query.type === 'view' ? [/containers/] : [],
      handleContent: content => Handlebars.compile(content)({
        view: query.type === 'view',
        name: params.name,
        ...query,
      }),
      to: `${params.name}/src`,
      complete: () => {
        process.chdir(params.name);
        command('tpl create reducer/quan');
        command(`tpl create package/react?name=${params.name}`);
        command('tpl create configs?type=react');
        command('tpl create webpack');
        command('tpl create components');
        if (query.type === 'view') {
          command('tpl create react/view/View');
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
          'babel-plugin-transform-runtime',
        ];
        if (query.type === 'view') {
          dependencies.push('react-router-dom');
          dependencies.push('react-router-redux@next');
          dependencies.push('history');
          dependencies.push('qs');
        }
        command(`npm install ${dependencies.join(' ')}`);
        command(`npm install --save-dev ${devDependencies.join(' ')}`);
      },
    });
  },
  'container/:name': ({ params, query }, cb) => {
    let to = `src/containers/${params.name}`;
    if (query.scene) {
      to = `src/scenes/${query.scene}/containers/${params.name}`;
    }
    cb({
      from: path.resolve(__dirname, 'containers'),
      handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
      handleContent: content => Handlebars.compile(content)({ name: params.name }),
      to,
    });
  },
  'container/component/:name': ({ params, query }) => {
    command(`tpl create container/${params.name}?${qs.stringify(query)}`);
    command(`tpl create component/${params.name}?${qs.stringify(query)}`);
  },
  'reducer/:name': ({ query, params }, cb) => {
    cb({
      from: path.resolve(__dirname, 'reducer/reducer.js'),
      handlePathName: name => (query.scene ? name : `${params.name}.js`),
      to: query.scene ?
        `src/scenes/${query.scene}/data/${params.name}` :
        'src/reducers',
      complete: () => {
        const _query = {
          list: query.scene ?
            fs.readdirSync(`src/scenes/${query.scene}/data`) :
            fs.readdirSync('src/reducers')
              .filter(a => a !== 'index.js' && !/\.swp$/.test(a))
              .map(a => path.basename(a, '.js')),
          scene: query.scene,
        };
        command(`tpl update 'rootReducer?${qs.stringify(_query)}'`);
      },
    });
  },
  rootReducer: ({ query }, cb) => {
    cb({
      from: path.resolve(__dirname, 'reducer/rootReducer.js'),
      handlePathName: () => (query.scene ? 'reducer.js' : 'index.js'),
      handleContent: content => Handlebars.compile(content)({
        scene: query.scene,
        list: (Array.isArray(query.list) ? // eslint-disable-line
          query.list : _.isEmpty(query.list) ? [] : [query.list]).map(a => ({
          reducer: a,
        })),
      }),
      to: query.scene ? `src/scenes/${query.scene}` : 'src/reducers',
    });
  },
  'action/:name': ({ params, query }, cb) => {
    cb({
      from: path.resolve(__dirname, 'reducer/actions.js'),
      handleContent: content => Handlebars.compile(content)({
        name: params.name,
        scene: query.scene,
        action: query.action,
        actionType: query.action.replace(/(.+?)(?=[A-Z])/g, a => `${a}_`).toUpperCase(),
      }),
      to: query.scene ?
        `src/scenes/${query.scene}/data/${params.name}` :
        'src/actions',
    });
  },
  'koa/:name': ({ params }, cb) => {
    cb({
      from: path.resolve(__dirname, 'koa'),
      to: params.name,
      handleContent: content => Handlebars.compile(content)({
        name: params.name,
      }),
      complete: () => {
        process.chdir(params.name);
        const dependencies = [
          'koa',
          'koa-router',
          'koa-logger',
        ];
        command(`npm install ${dependencies.join(' ')}`);
      },
    });
  },
  'test/:name': ({ params }) => {
    try {
      fs.readdirSync(params.name);
    } catch (e) {
      fs.mkdirSync(params.name);
    }
    process.chdir(params.name);
    command('tpl create configs');
    command(`echo "console.log('hello world');" > index.js`); // eslint-disable-line
  },
};
