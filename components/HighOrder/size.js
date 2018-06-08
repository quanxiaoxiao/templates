import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const wrapper = (WrapperComponent) => {
  class Wrapper extends PureComponent {
    constructor(props, context) {
      super(props, context);
      this.state = {
        width: 0,
        height: 0,
      };
      this.handleUpate = this.handleUpate.bind(this);
      this.nodeRef = React.createRef();
    }

    componentDidMount() {
      setTimeout(() => this.handleUpate(), 20);
      window.addEventListener('resize', this.handleUpate);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleUpate);
    }

    get style() {
      const { height, style = {} } = this.props;
      if (height != null) {
        return {
          ...style,
          position: 'relative',
          height,
        };
      }
      return {
        ...style,
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      };
    }

    handleUpate() {
      const { parentNode } = this.nodeRef.current;
      if (getComputedStyle(parentNode).position === 'static') {
        parentNode.style.position = 'relative';
      }
      const { width } = this.nodeRef.current.getBoundingClientRect();
      const { height = parentNode.clientHeight } = this.props;
      this.setState({
        width,
        height,
      });
    }

    render() {
      const {
        className,
        height: _height,
        style,
        forwardedRef,
        ...reset
      } = this.props;
      const { width, height } = this.state;
      return (
        <div
          className={className}
          ref={this.nodeRef}
          style={this.style}
        >
          {width !== 0 && height !== 0 &&
            <WrapperComponent
              {...reset}
              width={width}
              height={height}
              ref={forwardedRef}
            />
          }
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    className: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    forwardedRef: PropTypes.object,
  };

  return React.forwardRef((props, ref) => (
    <Wrapper {...props} forwardedRef={ref} />
  ));
};


export default wrapper;
