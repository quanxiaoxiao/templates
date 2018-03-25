import React from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const View = () => (
  <ConnectedRouter history={history}>
    <div>aaa</div>
  </ConnectedRouter>
);

export default hot(module)(View);
