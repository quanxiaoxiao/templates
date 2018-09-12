const path = require('path');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'docker/web/:name': ({ params }) => ({
    from: path.join(templatesDir, 'dockerWeb'),
    to: params.name,
  }),
};
