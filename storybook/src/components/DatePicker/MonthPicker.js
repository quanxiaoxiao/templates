import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import style from './MonthPicker.css';

const list = [
  { num: 0, name: '一月' },
  { num: 1, name: '二月' },
  { num: 2, name: '三月' },
  { num: 3, name: '四月' },
  { num: 4, name: '五月' },
  { num: 5, name: '六月' },
  { num: 6, name: '七月' },
  { num: 7, name: '八月' },
  { num: 8, name: '九月' },
  { num: 9, name: '十月' },
  { num: 10, name: '十一月' },
  { num: 11, name: '十二月' },
];

const MonthPicker = ({ current, onChange }) => {
  const currentMonth = moment().month();
  return (
    <div className={style.main}>
      {
        list.map(item => (
          <div
            key={item.num}
            className={cn(style.item, {
              [style.active]: item.num === current,
              [style.currentMonth]: currentMonth === item.num,
            })}
            onClick={() => onChange(item.num)}
          >
            <span>{item.name}</span>
          </div>
        ))
      }
    </div>
  );
};

MonthPicker.propTypes = {
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonthPicker;
