import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import style from './Slider.css';

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.sliderNode = React.createRef();
    this.containerNode = React.createRef();
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMoveOnDoc = this.handleMouseMoveOnDoc.bind(this);
    this.handleMouseUpOnDoc = this.handleMouseUpOnDoc.bind(this);
  }

  get clientRect() {
    return this.containerNode.current.getBoundingClientRect();
  }

  get percentage() {
    const {
      min,
      max,
      value,
    } = this.props;
    return _.clamp(1, 0, value / (max - min));
  }

  handleMouseDown(ev) {
    document.addEventListener('mousemove', this.handleMouseMoveOnDoc);
    document.addEventListener('mouseup', this.handleMouseUpOnDoc);
    const { target } = ev;
    if (this.sliderNode.current !== target) {
      const { onChange, min, max } = this.props;
      const { left, width } = this.clientRect;
      const { clientX } = ev;
      onChange((max - min) * (clientX - left) / width);
    }
    this.props.onSelect();
  }

  handleMouseMoveOnDoc(ev) {
    const { onChange, min, max } = this.props;
    const { left, width } = this.clientRect;
    const { clientX } = ev;
    onChange((max - min) * _.clamp(1, 0, (clientX - left) / width));
  }

  handleMouseUpOnDoc() {
    document.removeEventListener('mousemove', this.handleMouseMoveOnDoc);
    document.removeEventListener('mouseup', this.handleMouseUpOnDoc);
    this.props.onUnselect();
  }

  render() {
    const { percentage } = this;
    const {
      min,
      max,
      value,
      onChange,
      onSelect,
      onUnselect,
      ...other
    } = this.props;
    return (
      <div
        className={style.main}
        onMouseDown={this.handleMouseDown}
        ref={this.containerNode}
        {...other}
      >
        <div className={style.rail} />
        <div
          className={style.track}
          style={{ width: `${percentage * 100}%` }}
        />
        <div
          className={style.slider}
          style={{ left: `${percentage * 100}%` }}
          ref={this.sliderNode}
        />
      </div>
    );
  }
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  value: 0,
  onSelect: () => {},
  onUnselect: () => {},
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
};

export default Slider;

