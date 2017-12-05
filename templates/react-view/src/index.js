import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import './css/global.css';
import View from './scenes/View';

const store = configureStore();

render(
  <Provider store={store}>
    <View />
  </Provider>,
  document.getElementById('root'),
);
