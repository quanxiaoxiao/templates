const path = require('path');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

module.exports = {
  middlewares: [
    compress(),
    conditional(),
    etag(),
  ],
  api: {
    '/': {
      file: path.resolve(__dirname, 'static', 'index.html'),
    },
    '/page/*': {
      file: path.resolve(__dirname, 'static', 'index.html'),
    },
    '/static/*': {
      file: ctx => path.resolve(__dirname, 'static', ctx.params[0]),
    },
    '/assets/*': {
      file: ctx => path.resolve(__dirname, 'assets', ctx.params[0]),
    },
  },
};
