import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import View from 'scenes/View';

import configureStore from './store';
import './global.css';

const store = configureStore();

render(
  <Provider store={store}>
    <View />
  </Provider>,
  document.getElementById('root'),
);
