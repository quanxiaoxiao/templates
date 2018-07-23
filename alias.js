const shelljs = require('shelljs');
const qs = require('querystring');

module.exports = {
  '/c/:name': ({ params, query }) => ({
    next: () => {
      shelljs.exec(`tpl get 'component/${params.name}?${qs.stringify(query)}'`);
    },
  }),
  '/c/c/:name': ({ params, query }) => ({
    next: () => {
      shelljs.exec(`tpl get container/${params.name}?${qs.stringify(query)}`);
      shelljs.exec(`tpl get component/${params.name}?${qs.stringify(query)}`);
    },
  }),
};
