const path = require('path');
const shelljs = require('shelljs');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'norice/:name': ({ params }) => ({
    from: path.join(templatesDir, 'norice'),
    to: params.name,
    next: () => {
      process.chdir(params.name);
      const dependencies = [
        'koa-compress',
        'koa-conditional-get',
        'koa-etag',
        'lodash',
      ];
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
    },
  }),
};
