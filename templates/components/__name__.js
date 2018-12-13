{{#if clazz}}
import React, { PureComponent } from 'react';
{{else}}
import React from 'react';
{{/if}}
import PropTypes from 'prop-types';
import style from './{{name}}.css';

{{#if clazz}}
class {{name}} extends PureComponent {
  render() {
    return (
      <div className={style.main}>
      </div>
    );
  }
}
{{else}}
const {{name}} = () => (
  <div className={style.main}>
  </div>
);
{{/if}}

{{name}}.propTypes = {
};

export default {{name}};
