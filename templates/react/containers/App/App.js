import React from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line
import _ from 'lodash';
import style from './App.css';

const App = () => (
  <div className={style.main}>
    {
      _.times(24, i => (
        <span key={i}>
          {i}
        </span>
      ))
    }
    <div>3333333333</div>
    <div>4444444444</div>
  </div>
);

App.propTypes = {
};

export default hot(module)(App);
