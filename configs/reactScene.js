const path = require('path');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'react/scene/:name': ({ params }) => ({
    from: path.join(templatesDir, 'react-view', params.name === 'View' ? 'View' : 'Page'),
    handleContent: content => Handlebars.compile(content)({ name: params.name }),
    to: path.join('src', 'scenes', params.name),
  }),
};
