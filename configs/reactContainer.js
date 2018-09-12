const path = require('path');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'container/:name': ({ params, query }) => ({
    from: path.join(templatesDir, 'containers'),
    handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
    handleContent: content => Handlebars.compile(content)({
      name: params.name,
      fetchPolling: !!query.fetchPolling,
    }),
    to: query.scene ?
      path.join('src', 'scenes', query.scene, 'containers', params.name) :
      path.join('src', 'containers', params.name),
  }),
};
