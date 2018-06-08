import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Layout from '../Layout';
import Slider from '../Slider';
import style from './TimePicker.css';

class TimePicker extends PureComponent {
  state = {
    stayAt: null,
    current: null,
  }

  render() {
    const {
      stayAt,
      current,
    } = this.state;
    const {
      hour,
      minute,
      onChangeHour,
      onChangeMinute,
    } = this.props;
    return (
      <Layout
        className={style.main}
        verticalCenter
      >
        <Layout.Item
          width="auto"
          className={style.timeValues}
        >
          <span
            className={cn(style.hourValue, {
              [style.active]: current === 'hour' || stayAt === 'hour',
            })}
          >
            {`${hour}`.padStart(2, '0')}
          </span>
          <span className={style.colon}>:</span>
          <span
            className={cn(style.miniteValue, {
              [style.active]: current === 'minute' || stayAt === 'minute',
            })}
          >
            {`${minute}`.padStart(2, '0')}
          </span>
        </Layout.Item>
        <Layout.Item gap={10}>
          <div className={style.hourSlider}>
            <Slider
              value={hour}
              max={23}
              onChange={a => onChangeHour(Math.floor(a))}
              onSelect={() => this.setState({ current: 'hour' })}
              onUnselect={() => this.setState({ current: null })}
              onMouseEnter={() => this.setState({ stayAt: current !== 'minute' && 'hour' })}
              onMouseLeave={() => this.setState({ stayAt: null })}
            />
          </div>
          <div>
            <Slider
              value={minute}
              max={59}
              onChange={a => onChangeMinute(Math.floor(a))}
              onSelect={() => this.setState({ current: 'minute' })}
              onUnselect={() => this.setState({ current: null })}
              onMouseEnter={() => this.setState({ stayAt: current !== 'hour' && 'minute' })}
              onMouseLeave={() => this.setState({ stayAt: null })}
            />
          </div>
        </Layout.Item>
      </Layout>
    );
  }
}

TimePicker.propTypes = {
  hour: PropTypes.number.isRequired,
  minute: PropTypes.number.isRequired,
  onChangeHour: PropTypes.func.isRequired,
  onChangeMinute: PropTypes.func.isRequired,
};

export default TimePicker;
