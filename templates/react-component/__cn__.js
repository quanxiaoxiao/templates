import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './{{name}}.css';

export const {{name}} = ({ className }) => (
  <div className={cn(style.main, className)}>
  </div>
);

{{name}}.propTypes = {
  className: PropTypes.string,
};

export default {{name}};

