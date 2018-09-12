const path = require('path');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'action/:name': ({ params, query }) => ({
    from: path.join(templatesDir, 'reducer', 'actions.js'),
    handleContent: content => Handlebars.compile(content)({
      name: params.name,
      scene: query.scene,
      action: query.action,
      actionType: query.action.replace(/(.+?)(?=[A-Z])/g, a => `${a}_`).toUpperCase(),
    }),
    to: query.scene ?
      path.join('src', 'scenes', query.scene, 'data', params.name) :
      params.join('src', 'data', query.name),
  }),
};
