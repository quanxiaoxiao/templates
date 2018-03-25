module.exports = {
  default: {
    extend: 'component',
    '/view': 'src/scenes/View/components/_',
  },
  container: {
    extend: 'container',
    '/view': 'src/scenes/View/containers/_',
  },
  reducer: {
    extend: 'reducer',
    '/root': {
      from: 'templates/reducer.js',
      to: 'src/data/_',
    },
    '/view': {
      from: 'templates/reducer.js',
      to: 'src/scenes/View/data/_',
    },
  },
};
