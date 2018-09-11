import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
{{#if view }}
import View from './scenes/View';
{{else}}
import App from 'containers/App';
{{/if}}
import configureStore from './store';
import './global.css';

const store = configureStore();

render(
  <Provider store={store}>
    {{#if view }}
    <View />
    {{else}}
    <App />
    {{/if}}
  </Provider>,
  document.getElementById('root'),
);
