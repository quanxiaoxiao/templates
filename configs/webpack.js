const path = require('path');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  webpack: ({ query }) => ({
    from: query.type === 'react' ?
      path.join(templatesDir, 'webpack', 'react') :
      path.join(templatesDir, 'webpack', 'simple'),
  }),
};
