const path = require('path');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  'component/:name': ({ params, query }) => {
    const exclude = [];
    let to = `src/components/${params.name}`;
    if (query.name) {
      exclude.push(/index\.js$/);
    }
    if (query.scene) {
      to = `src/scenes/${query.scene}/components/${params.name}`;
    }
    if (query.view) {
      to = `src/View/components/${params.name}`;
    }
    return {
      from: path.join(templatesDir, 'components'),
      handlePathName: name => name.replace(/__name__(?=\.)/, query.name || params.name),
      exclude,
      handleContent: content => Handlebars.compile(content)({
        ...query,
        name: query.name || params.name,
      }),
      to,
    };
  },
};
