const shelljs = require('shelljs');
const qs = require('querystring');

module.exports = {
  '/c/:name': ({ params, query }) => {
    shelljs.exec(`tpl create 'component/${params.name}?${qs.stringify(query)}'`);
  },
  '/c/c/:name': ({ params, query }) => {
    shelljs.exec(`tpl create 'container/component/${params.name}?${qs.stringify(query)}'`);
  },
  '/r/v:name': ({ params, query }) => {
    shelljs.exec(`tpl create 'react/view/${params.name}?${qs.stringify(query)}'`);
  },
};
