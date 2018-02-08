import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import rootReducer from '../data/reducer';

export default function configureStore(initialState = {}) {
  const middlewares = [
    thunkMiddleware,
    promiseMiddleware,
    thunkMiddleware,
  ];
  const enhancers = [];

  if (process.env.NODE_ENV === 'development') {
    const { createLogger } = require('redux-logger'); // eslint-disable-line
    const loggerMiddleware = createLogger({
      level: 'info',
      collapsed: true,
    });
    middlewares.push(loggerMiddleware);
    const { devToolsExtension } = window;
    if (devToolsExtension) {
      enhancers.push(devToolsExtension());
    }
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers,
    ),
  );

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../data/reducer', () => {
      store.replaceReducer(require('../data/reducer').default);
    });
  }
  return store;
}
