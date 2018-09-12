const path = require('path');
const shelljs = require('shelljs');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'client/:name': ({ params }) => {
    if (!shelljs.test('-d', params.name)) {
      shelljs.mkdir(params.name);
    }
    process.chdir(params.name);
    return {
      from: path.join(templatesDir, 'client'),
      to: 'src',
      next: () => {
        shelljs.exec(`tpl get "configs?type=client&name=${params.name}"`);
        shelljs.exec('tpl get webpack');
      },
    };
  },
};
