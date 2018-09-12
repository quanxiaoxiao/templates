const path = require('path');
const shelljs = require('shelljs');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'server/:name': ({ params }) => ({
    from: path.join(templatesDir, 'server'),
    to: params.name,
    next: () => {
      process.chdir(params.name);
      shelljs.exec('npm install');
    },
  }),
};
