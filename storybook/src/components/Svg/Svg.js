/* eslint react/no-array-index-key:0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { size as wrapper } from '../HighOrder';

class Svg extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.nodeRef = React.createRef();
  }

  get margin() {
    const { margin = {} } = this.props;
    return {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      ...margin,
    };
  }

  get width() {
    const { width } = this.props;
    const { left, right } = this.margin;
    return width - left - right;
  }

  get height() {
    const { height } = this.props;
    const { top, bottom } = this.margin;
    return height - top - bottom;
  }

  get clientRect() {
    const { width, height, margin } = this;
    const { top, left } = this.nodeRef.current.getBoundingClientRect();
    return {
      width,
      height,
      top: top + margin.top,
      left: left + margin.left,
    };
  }

  handleEventListener(listener, { target, clientX, clientY }) {
    const { width, height } = this;
    const { left, top } = target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    listener({
      x,
      y,
      width,
      height,
    });
  }

  renderEventsLayer() {
    const eventProps = Object.entries(this.props)
      .filter(([key, value]) => /^on[A-Z]\w+/.test(key) && _.isFunction(value))
      .reduce((props, [key, listener]) => ({
        ...props,
        [key]: this.handleEventListener.bind(this, listener),
      }), {});

    if (_.isEmpty(eventProps)) {
      return null;
    }

    const { width, height } = this;
    return (
      <rect
        width={width}
        height={height}
        fill="none"
        pointerEvents="all"
        {...eventProps}
      />
    );
  }

  render() {
    const { position, children, className } = this.props;
    const { top, left } = this.margin;
    const { width, height } = this;

    let result;
    if (Array.isArray(children)) {
      result = children
        .map(render => render({ width, height }))
        .filter(child => child)
        .map((child, i) =>
          React.cloneElement(child, { key: i }));
    } else {
      const child = children({ width, height });
      if (child) {
        result = React.cloneElement(child);
      }
    }

    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={this.nodeRef}
        className={className}
      >
        <g
          transform={position === 'topLeft' ?
            `translate(${left}, ${top})` :
            `translate(${width / 2 + left}, ${height / 2 + top})`}
        >
          {
            !_.isEmpty(result) && result
          }
          {this.renderEventsLayer()}
        </g>
      </svg>
    );
  }
}

Svg.defaultProps = {
  position: 'topLeft',
};

Svg.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['topLeft', 'center']),
  margin: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]).isRequired,
};

export default wrapper(Svg);

