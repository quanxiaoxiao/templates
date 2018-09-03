const qs = require('querystring');
const path = require('path');
const os = require('os');
const Handlebars = require('handlebars');
const shelljs = require('shelljs');
const alias = require('./alias');

module.exports = {
  'component/:name': ({ params, query }) => {
    const exclude = [];
    let to = `src/components/${params.name}`;
    if (query.name) {
      exclude.push(/index\.js$/);
    }
    if (query.scene) {
      to = `src/scenes/${query.scene}/components/${params.name}`;
    }
    return {
      from: path.resolve(__dirname, 'components'),
      handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
      exclude,
      handleContent: content => Handlebars.compile(content)({
        ...query,
        name: query.name || params.name,
      }),
      to,
    };
  },
  configs: ({ query }) => {
    const include = [
      /\.gitignore$/,
      /\.editorconfig$/,
      /\.eslintrc$/,
    ];
    if (query.type === 'react' || query.type === 'client') {
      include.push(/norice\.config\.js$/);
      include.push(/postcss\.config\.js/);
      include.push(/\.babelrc$/);
      include.push(/package\.json$/);
    }
    return {
      from: path.resolve(__dirname, 'config'),
      handleContent: content => Handlebars.compile(content)({
        name: query.name,
        react: query.type === 'react',
        client: query.type === 'react' || query.type === 'client',
      }),
      include,
    };
  },
  webpack: ({ query }) => ({
    from: query.type === 'react' ?
      path.resolve(__dirname, 'webpack', 'react') :
      path.resolve(__dirname, 'webpack', 'simple'),
  }),
  'react/view/:name': ({ params }) => ({
    from: path.resolve(__dirname, 'react-view', params.name === 'View' ? 'View' : 'Page'),
    handleContent: content => Handlebars.compile(content)({ name: params.name }),
    to: path.join('src', 'scenes', params.name),
  }),
  'react/:name': ({ query, params }) => ({
    from: path.resolve(__dirname, 'react'),
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
        shelljs.exec('tpl get react/view/View');
        shelljs.exec('tpl get react/view/Home');
        shelljs.exec('tpl get rootReducer?type=view');
      } else {
        shelljs.exec('tpl get reducer/main');
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
        '@babel/core',
        '@babel/preset-env',
        '@babel/runtime',
        '@babel/preset-react',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-export-default-from',
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
  'container/:name': ({ params, query }) => ({
    from: path.resolve(__dirname, 'containers'),
    handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
    handleContent: content => Handlebars.compile(content)({
      name: params.name,
      fetchPolling: !!query.fetchPolling,
    }),
    to: query.scene ?
      path.join('src', 'scenes', query.scenes, 'containers', params.name) :
      params.join('src', 'containers', params.name),
  }),
  'reducer/:name': ({ query, params }) => {
    const toDir = query.scene ?
      `src/scenes/${query.scene}/data` :
      'src/data';
    return {
      from: path.resolve(__dirname, 'reducer', 'reducer.js'),
      handlePathName: () => 'reducer.js',
      to: path.join(toDir, params.name),
      next: () => {
        shelljs.exec(`tpl get rootReducer?${qs.stringify(query)} --cover true`);
      },
    };
  },
  rootReducer: ({ query }) => {
    const toDir = query.scene ?
      path.join('src', 'scenes', query.scenes, 'data') :
      path.join('src', 'data');
    let list = [];
    try {
      list = shelljs.ls(toDir)
        .filter(item => shelljs.test('-d', path.join(toDir, item)))
        .map(name => ({
          importName: `${name}Reducer`,
          importPath: `./${name}/reducer`,
          reduerLine: `${name}: ${name}Reducer`,
        }));
    } catch (error) {
      // ignore
    }
    if (!query.scene && shelljs.test('-d', 'src/scenes')) {
      try {
        list = [
          ...shelljs.find('src/scenes/*/data/reducer.js')
            .map((item) => {
              const [, , name] = item.split('/');
              const _name = name.replace(/^[A-Z]/, a => a.toLowerCase());
              return {
                importName: `${_name}Reducer`,
                importPath: `scenes/${name}/data/reducer`,
                reduerLine: `${name}: ${_name}Reducer`,
              };
            }),
          ...list,
        ];
      } catch (e) {
        // ignore
      }
    }
    if (!query.scene && query.type === 'view') {
      list = [
        {
          importName: '{ routerReducer }',
          importPath: 'react-router-redux',
          reduerLine: 'router: routerReducer',
        },
        ...list,
      ];
    }
    return {
      from: path.resolve(__dirname, 'reducer', 'rootReducer.js'),
      handlePathName: () => 'reducer.js',
      handleContent: content => Handlebars.compile(content)({
        list,
      }),
      to: toDir,
      next: () => {
        if (shelljs.test('-d', 'src/scenes') && query.scene) {
          shelljs.exec('tpl get rootReducer?type=view --cover true');
        }
      },
    };
  },
  'action/:name': ({ params, query }) => ({
    from: path.resolve(__dirname, 'reducer', 'actions.js'),
    handleContent: content => Handlebars.compile(content)({
      name: params.name,
      scene: query.scene,
      action: query.action,
      actionType: query.action.replace(/(.+?)(?=[A-Z])/g, a => `${a}_`).toUpperCase(),
    }),
    to: query.scene ?
      path.join('src', 'scenes', query.scenes, 'data', params.name) :
      params.join('src', 'data', query.name),
  }),
  'koa/:name': ({ params }) => ({
    from: path.resolve(__dirname, 'koa'),
    to: params.name,
    handleContent: content => Handlebars.compile(content)({
      name: params.name,
    }),
    next: () => {
      process.chdir(params.name);
      const dependencies = [
        'koa',
        'koa-router',
        'koa-logger',
      ];
      shelljs.exec('tpl get configs');
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
    },
  }),
  'test/:name': ({ params }) => ({
    next: () => {
      if (!shelljs.test('-d', params.name)) {
        shelljs.mkdir(params.name);
      }
      process.chdir(params.name);
      shelljs.exec('tpl get configs');
      shelljs.exec('npm init -y');
      shelljs.exec(`echo "console.log('hello world');" > index.js`); // eslint-disable-line
    },
  }),

  'client/:name': ({ params }) => {
    if (!shelljs.test('-d', params.name)) {
      shelljs.mkdir(params.name);
    }
    process.chdir(params.name);
    return {
      from: path.resolve(__dirname, 'client'),
      to: 'src',
      next: () => {
        shelljs.exec(`tpl get "configs?type=client&name=${params.name}"`);
        shelljs.exec('tpl get webpack');
      },
    };
  },
  'server/:name': ({ params }) => ({
    from: path.resolve(os.homedir(), 'soft/web-server'),
    exclude: [/\.git\b/, /node_modules/, /logs/],
    to: params.name,
    next: () => {
      process.chdir(params.name);
      shelljs.exec('npm install');
    },
  }),
  ...alias,
};
