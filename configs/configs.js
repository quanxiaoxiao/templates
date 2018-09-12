const path = require('path');
const Handlebars = require('handlebars');

const templatesDir = path.resolve(__dirname, '..', 'templates');

module.exports = {
  configs: ({ query }) => {
    const include = [
      /\.gitignore$/,
      /\.editorconfig$/,
      /\.eslintrc$/,
    ];
    if (query.type === 'react' || query.type === 'client') {
      include.push(/norice\.config\.js$/);
      include.push(/postcss\.config\.js/);
      include.push(/\.babelrc$/);
      include.push(/package\.json$/);
    }
    return {
      from: path.join(templatesDir, 'config'),
      handleContent: content => Handlebars.compile(content)({
        name: query.name,
        react: query.type === 'react',
        client: query.type === 'react' || query.type === 'client',
      }),
      include,
    };
  },
};
