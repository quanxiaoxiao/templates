import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './{{name}}.scss';

class {{name}} extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { className } = this.props;
    return (
      <div className={cn(style.main, className)}>
      </div>
    );
  }
}

{{name}}.propTypes = {
  className: PropTypes.string,
};

export default {{name}};
