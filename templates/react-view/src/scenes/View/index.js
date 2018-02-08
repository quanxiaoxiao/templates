import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import style from './index.css';

import Home from '../Home';

const history = createHistory();

const View = () => (
  <ConnectedRouter history={history}>
    <div className={style.main}>
      <Route exact path="/" component={Home} />
    </div>
  </ConnectedRouter>
);

export default View;
