import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Layout from '../Layout';
import style from './Nav.css';

class Nav extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleClickOnPrev = this.handleClickOnPrev.bind(this);
    this.handleClickOnNext = this.handleClickOnNext.bind(this);
  }

  get yearRange() {
    const { year } = this.props;
    const [a] = year.toString().match(/^\d\d\d(?=\d)/);
    return `${a}0-${a}9`;
  }

  handleChangeType() {
    const { type, onChangeType } = this.props;
    if (type === 'day' || type === 'year') {
      onChangeType('month');
    } else if (type === 'month') {
      onChangeType('year');
    }
  }

  handleClickOnPrev() {
    const {
      type,
      onChangeMonth,
      onChangeYear,
    } = this.props;
    if (type === 'day') {
      onChangeMonth(-1);
    } else if (type === 'month') {
      onChangeYear(-1);
    } else if (type === 'year') {
      onChangeYear(-10);
    }
  }

  handleClickOnNext() {
    const {
      type,
      onChangeMonth,
      onChangeYear,
    } = this.props;
    if (type === 'day') {
      onChangeMonth(1);
    } else if (type === 'month') {
      onChangeYear(1);
    } else if (type === 'year') {
      onChangeYear(10);
    }
  }

  render() {
    const {
      year,
      month,
      type,
    } = this.props;
    return (
      <Layout
        className={style.main}
        justify="between"
      >
        <Layout.Item
          className={style.navBtn}
          onClick={this.handleClickOnPrev}
        >
          <svg
            width={32}
            height={32}
          >
            <path
              d="M 17,12 l -5,5 l 5,5"
              fill="none"
              stroke="#9c9c9c"
              strokeWidth={2}
            />
          </svg>
        </Layout.Item>
        <Layout.Item
          className={style.info}
          onClick={this.handleChangeType}
        >
          {type === 'day' &&
            <Fragment>
              <span className={style.year}>{year}年</span>
              <span className={style.month}>{month + 1}月</span>
            </Fragment>
          }
          {type === 'month' &&
            <span className={style.year}>{year}年</span>
          }
          {type === 'year' &&
            <span>{this.yearRange}</span>
          }
        </Layout.Item>
        <Layout.Item
          className={style.navBtn}
          onClick={this.handleClickOnNext}
        >
          <svg
            width={32}
            height={32}
          >
            <path
              d="M 14,12 l 5,5 l -5,5"
              fill="none"
              stroke="#9c9c9c"
              strokeWidth={2}
            />
          </svg>
        </Layout.Item>
      </Layout>
    );
  }
}

Nav.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func.isRequired,
  onChangeMonth: PropTypes.func.isRequired,
};

export default Nav;
