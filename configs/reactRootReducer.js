const path = require('path');
const shelljs = require('shelljs');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  rootReducer: ({ query }) => {
    const toDir = query.scene ?
      path.join('src', 'scenes', query.scene, 'data') :
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
      from: path.join(templatesDir, 'reducer', 'rootReducer.js'),
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
};
