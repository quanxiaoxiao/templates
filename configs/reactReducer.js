const path = require('path');
const qs = require('querystring');
const shelljs = require('shelljs');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'reducer/:name': ({ query, params }) => {
    const toDir = query.scene ?
      path.join('src', 'scenes', query.scene, 'data') :
      path.join('src', 'data');
    return {
      from: path.join(templatesDir, 'reducer', 'reducer.js'),
      handlePathName: () => 'reducer.js',
      to: path.join(toDir, params.name),
      next: () => {
        shelljs.exec(`tpl get rootReducer?${qs.stringify(query)} --cover true`);
      },
    };
  },
};
