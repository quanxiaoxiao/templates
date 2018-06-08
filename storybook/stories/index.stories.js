import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';

import DatePicker from '../src/components/DatePicker';
import '../src/global.css';

class Quan extends Component {
  state = {
    value: [],
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <div
          style={{
            height: 33,
            lineHeight: '32px',
            borderBottom: '1px solid #ccc',
            marginBottom: 20,
          }}
        >
          <span>{value.join(',')}</span>
        </div>
        <div>
          <DatePicker
            onChange={a => this.setState({ value: a })}
            value={value}
            hasTime
          />
        </div>
      </div>
    );
  }
}

storiesOf('DatePicker', module)
  .add('default', () => <DatePicker value="2018-08-08" />)
  .add('hasTime', () => <DatePicker hasTime />)
  .add('multiple values', () => (
    <DatePicker
      value={['2018-06-06', '2018-06-22', '2018-07-15', '2018-07-10']}
    />
  ))
  .add('operate', () => <Quan />);
