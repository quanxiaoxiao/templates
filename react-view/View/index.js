import React, { Fragment } from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import Home from '../Home';
import style from './index.css';

const history = createHistory();

const View = () => (
  <ConnectedRouter history={history}>
    <Fragment>
      <Route
        path="/"
        exact
        component={Home}
      />
    </Fragment>
  </ConnectedRouter>
);

export default hot(module)(View);
