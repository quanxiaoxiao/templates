import React from 'react';
import PropTypes from 'prop-types';

const wrapper = (WrapperComponent) => {
  const Wrapper = ({ isShow, ...other }) => (
    isShow ? <WrapperComponent {...other} /> : null
  );

  Wrapper.propTypes = {
    isShow: PropTypes.bool.isRequired,
  };

  return Wrapper;
};

export default wrapper;
