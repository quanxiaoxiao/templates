const shelljs = require('shelljs');

module.exports = {
  'test/:name': ({ params }) => ({
    next: () => {
      if (!shelljs.test('-d', params.name)) {
        shelljs.mkdir(params.name);
      }
      process.chdir(params.name);
      shelljs.exec('tpl get configs');
      shelljs.exec('npm init -y');
      shelljs.exec('echo "console.log(\'hello world\');" > index.js');
    },
  }),
};
