{{#if clazz}}
import React from 'react';
{{else}}
import React, { PureComponent } from 'react';
{{/if}}
import PropTypes from 'prop-types';
import style from './{{name}}.css';

{{#if type}}
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

