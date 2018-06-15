const qs = require('querystring');
const path = require('path');
const Handlebars = require('handlebars');
const shelljs = require('shelljs');

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
          shelljs.exec('npm install moment');
        }
      },
    });
  },
  configs: ({ query }, cb) => {
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
    cb({
      from: path.resolve(__dirname, 'config'),
      handleContent: content => Handlebars.compile(content)({
        name: query.name,
        react: query.type === 'react',
        client: query.type === 'react' || query.type === 'client',
      }),
      include,
      to: '',
    });
  },
  webpack: ({ query }, cb) => {
    let from = path.resolve(__dirname, 'webpack/simple');
    if (query.type === 'react') {
      from = path.resolve(__dirname, 'webpack/react');
    }
    cb({
      from,
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
        shelljs.exec(`tpl create "configs?type=react&name=${params.name}"`);
        shelljs.exec('tpl create webpack?type=react');
        shelljs.exec('tpl create components');
        if (query.type === 'view') {
          shelljs.exec('tpl create react/view/View');
          shelljs.exec('tpl create reducer/resource?scene=root');
        } else {
          shelljs.exec('tpl create reducer/resource');
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
        shelljs.exec(`npm install ${dependencies.join(' ')}`);
        shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
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
    shelljs.exec(`tpl create container/${params.name}?${qs.stringify(query)}`);
    shelljs.exec(`tpl create component/${params.name}?${qs.stringify(query)}`);
  },
  'reducer/:name': ({ query, params }, cb) => {
    const toDir = (query.scene && query.scene !== 'root') ?
      `src/scenes/${query.scene}/data` :
      'src/data';
    cb({
      from: path.resolve(__dirname, 'reducer/reducer.js'),
      handlePathName: () => 'reducer.js',
      to: path.join(toDir, params.name),
      complete: () => {
        shelljs.exec(`tpl update 'rootReducer?${qs.stringify(query)}'`);
      },
    });
  },
  rootReducer: ({ query }, cb) => {
    const toDir = (query.scene && query.scene !== 'root') ?
      `src/scenes/${query.scene}/data` :
      'src/data';
    const list = shelljs.ls('-l', toDir)
      .filter(item => item.isDirectory())
      .map(item => item.name);
    let sceneList = [];
    if (query.scene === 'root') {
      try {
        sceneList = shelljs.find('src/scenes/*/reducer.js')
          .map(pathName => ({
            pathName: pathName.replace(/^src\//, ''),
            name: pathName.match(/\/([^/]+)\/reducer\.js$/)[1],
          }));
      } catch (e) {
        // ignore
      }
    }
    cb({
      from: path.resolve(__dirname, 'reducer/rootReducer.js'),
      handlePathName: () => 'reducer.js',
      handleContent: content => Handlebars.compile(content)({
        scene: query.scene && query.scene !== 'root',
        hasRouter: query.scene === 'root',
        sceneList,
        list: list.map(name => ({
          reducer: name,
        })),
      }),
      to: (query.scene && query.scene !== 'root') ? `src/scenes/${query.scene}` : 'src/data',
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
        `src/data/${query.name}`,
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
        shelljs.exec('tpl create configs');
        shelljs.exec(`npm install ${dependencies.join(' ')}`);
      },
    });
  },
  'test/:name': ({ params }) => {
    if (!shelljs.test('-d', params.name)) {
      shelljs.mkdir(params.name);
    }
    process.chdir(params.name);
    shelljs.exec('tpl create configs');
    shelljs.exec(`echo "console.log('hello world');" > index.js`); // eslint-disable-line
    // shelljs.exec(`tmux new-window -d -n ${params.name} "vim index.js"`);
  },

  'client/:name': ({ params }, cb) => {
    if (!shelljs.test('-d', params.name)) {
      shelljs.mkdir(params.name);
    }
    process.chdir(params.name);
    cb({
      from: path.resolve(__dirname, 'client'),
      to: 'src',
      complete: () => {
        shelljs.exec(`tpl create "configs?type=client&name=${params.name}"`);
        shelljs.exec('tpl create webpack');
      },
    });
  },
};
