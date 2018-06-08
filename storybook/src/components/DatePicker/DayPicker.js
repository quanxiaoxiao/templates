import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import moment from 'moment';
import Layout from '../Layout';
import style from './DayPicker.css';

const weekMap = [
  '一', '二', '三', '四',
  '五', '六', '日',
];

class DayPicker extends PureComponent {
  get dayList() {
    const { year, month } = this.props;
    const obj = moment().year(year).month(month);
    const startMonth = obj.clone().startOf('month');
    const startMonthWeek = startMonth.day() === 0 ?
      startMonth.clone().subtract(6, 'days') :
      startMonth.clone().startOf('week').add(1, 'days');
    const endMonth = obj.clone().endOf('month');
    const endMonthWeek = endMonth.day() === 0 ?
      endMonth.clone() :
      endMonth.clone().endOf('week').add(1, 'days');

    return [startMonthWeek, ..._.times(endMonthWeek.diff(startMonthWeek, 'days'), i =>
      startMonthWeek.clone().add(i + 1, 'days'))];
  }

  render() {
    const { dayList } = this;
    const now = moment();
    const {
      year,
      month,
      onSelect,
      disabledDays,
      selectedDays,
    } = this.props;
    const obj = moment().year(year).month(month);
    return (
      <div className={style.main}>
        <Layout className={style.weeks}>
          {
            _.times(7, i => (
              <Layout.Item
                key={i}
                className={style.weekName}
              >
                <span>{weekMap[i]}</span>
              </Layout.Item>
            ))
          }
        </Layout>
        <div className={style.dayList}>
          {
            dayList.map(item => (
              <div
                key={item.toString()}
                className={cn(style.day, {
                  [style.otherMonth]: !obj.isSame(item, 'month'),
                  [style.today]: item.isSame(now, 'date'),
                  [style.selected]: selectedDays.some(a => item.isSame(a, 'day')),
                  [style.disabled]: disabledDays(item.format('YYYY-MM-DD')),
                })}
                onClick={() => {
                  if (disabledDays(item.format('YYYY-MM-DD'))) {
                    return;
                  }
                  onSelect(item);
                }}
              >
                <span>{item.date()}</span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

DayPicker.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabledDays: PropTypes.func.isRequired,
  selectedDays: PropTypes.array.isRequired,
};

export default DayPicker;
