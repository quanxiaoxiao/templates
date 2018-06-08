import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import DayPicker from './DayPicker';
import TimePicker from './TimePicker';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';
import Nav from './Nav';
import style from './DatePicker.css';

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    const { value = moment() } = this;
    this.state = {
      current: value.clone(),
      displayType: 'day',
    };
    this.handleChangeHour = this.handleChangeHour.bind(this);
    this.handleChangeMinute = this.handleChangeMinute.bind(this);
    this.handleSelectOnDay = this.handleSelectOnDay.bind(this);
    this.handleSelectOnYear = this.handleSelectOnYear.bind(this);
  }

  get format() {
    const { hasTime } = this.props;
    return hasTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
  }

  get valueList() {
    const { value } = this.props;
    const { format } = this;
    if (!value) {
      return [];
    }
    if (_.isString(value)) {
      return [moment(value, format)];
    }
    return value.map(item => moment(item, format));
  }

  get value() {
    return _.last(this.valueList);
  }

  get hour() {
    const { value } = this;
    const { current } = this.state;
    return value ? value.hour() : current.hour();
  }

  get minute() {
    const { value } = this;
    const { current } = this.state;
    return value ? value.minute() : current.minute();
  }

  get month() {
    const { current } = this.state;
    return current.month();
  }

  get year() {
    const { current } = this.state;
    return current.year();
  }

  handleChangeHour(hour) {
    const { onChange } = this.props;
    const { format, value, valueList } = this;
    const { current } = this.state;
    const obj = current.clone().hour(hour);
    if (_.isEmpty(this.props.value)) {
      onChange(_.isArray(this.props.value) ? [obj.format(format)] : obj.format(format));
    } else {
      onChange(_.isArray(this.props.value) ?
        valueList.map((item, i) => {
          if (i === valueList.length - 1) {
            return item.clone().hour(hour).format(format);
          }
          return item.format(format);
        }) :
        value.clone().hour(hour).format(format));
    }

    this.setState({
      current: obj,
    });
  }

  handleChangeMinute(minute) {
    const { onChange } = this.props;
    const { format, value, valueList } = this;
    const { current } = this.state;
    const obj = current.clone().minute(minute);
    if (_.isEmpty(this.props.value)) {
      onChange(_.isArray(this.props.value) ? [obj.format(format)] : obj.format(format));
    } else {
      onChange(_.isArray(this.props.value) ?
        valueList.map((item, i) => {
          if (i === valueList.length - 1) {
            return item.clone().minute(minute).format(format);
          }
          return item.format(format);
        }) :
        value.clone().minute(minute).format(format));
    }

    this.setState({
      current: obj,
    });
  }

  handleSelectOnDay(day) {
    const { onChange, value } = this.props;
    const { valueList, format } = this;
    const { current } = this.state;
    if (valueList.some(item => item.isSame(day, 'day'))) {
      onChange(_.isArray(value) ?
        valueList
          .filter(item => !item.isSame(day, 'day'))
          .map(item => item.format(format)) : '');
      return;
    }
    if (current.isBefore(day, 'month')) {
      this.setState({
        current: current.clone().add(1, 'month'),
      });
    } else if (current.isAfter(day, 'month')) {
      this.setState({
        current: current.clone().subtract(1, 'month'),
      });
    }
    const date = day.clone().hour(this.hour).minute(this.minute);
    onChange(_.isArray(value) ? [...value, date.format(format)] : date.format(format));
  }

  handleSelectOnYear(year) {
    const { current } = this.state;
    this.setState({
      current: current.clone().year(year),
      displayType: 'month',
    });
  }

  render() {
    const { current, displayType } = this.state;
    const { hasTime, disabledDays } = this.props;
    const { valueList } = this;
    return (
      <div className={style.main}>
        <Nav
          onChangeType={a => this.setState({ displayType: a })}
          type={displayType}
          onChangeYear={a => this.setState({
            current: current.clone().add(a, 'year'),
          })}
          onChangeMonth={a => this.setState({
            current: current.clone().add(a, 'month'),
          })}
          year={this.year}
          month={this.month}
        />
        <div className={style.content}>
          {displayType === 'day' &&
            <DayPicker
              year={this.year}
              month={this.month}
              selectedDays={valueList}
              onSelect={this.handleSelectOnDay}
              disabledDays={disabledDays}
            />
          }
          {displayType === 'month' &&
            <MonthPicker
              current={this.month}
              onChange={a => this.setState({
                current: current.clone().month(a),
                displayType: 'day',
              })}
            />
          }
          {displayType === 'year' &&
            <YearPicker
              current={this.year}
              onSelect={this.handleSelectOnYear}
            />
          }
        </div>
        {hasTime && displayType === 'day' &&
          <TimePicker
            hour={this.hour}
            minute={this.minute}
            onChangeHour={this.handleChangeHour}
            onChangeMinute={this.handleChangeMinute}
          />
        }
      </div>
    );
  }
}

DatePicker.defaultProps = {
  disabledDays: () => false,
};

DatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  hasTime: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabledDays: PropTypes.func,
};

export default DatePicker;

