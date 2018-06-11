module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
    'postcss-css-variables': {
      variables: {
        '--background-color': '#fff',
        '--font-color': '#333',
        '--main-color': '#073547',
        '--border-color': '#1a5576',
        '--active-color': '#00babd',
        '--secondary-color': '#147399',
        '--axis-color': '#fff',
      },
    },
    'postcss-color-function': {},
  },
};
