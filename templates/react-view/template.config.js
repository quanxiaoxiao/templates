module.exports = {
  default: {
    extend: 'component',
    '/view': 'src/scenes/View/components/_',
    '/home': 'src/scenes/Home/components/_',
  },
  container: {
    extend: 'container',
    '/view': 'src/scenes/View/containers/_',
    '/home': 'src/scenes/Home/containers/_',
  },
  reducer: {
    extend: 'reducer',
    '/root': {
      from: 'templates/reducer.js',
      to: 'src/data/_',
    },
    '/home': {
      from: 'templates/reducer.js',
      to: 'src/scenes/Home/data/_',
    },
  },
};
