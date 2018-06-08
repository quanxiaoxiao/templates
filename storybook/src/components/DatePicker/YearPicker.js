import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import style from './YearPicker.css';

class YearPicker extends PureComponent {
  get yearList() {
    const { current } = this.props;
    const [, a] = current.toString().match(/(\d\d\d)\d/);
    const list = _.times(10, i => parseInt(`${a}${i}`, 10));
    return [_.first(list) - 1, ...list, _.last(list) + 1];
  }

  render() {
    const { yearList } = this;
    const { current, onSelect } = this.props;
    return (
      <div>
        {
          yearList.map(year => (
            <div
              key={year}
              className={cn(style.item, {
                [style.selected]: current === year,
              })}
              onClick={() => onSelect(year)}
            >
              <span>{year}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

YearPicker.propTypes = {
  current: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default YearPicker;
