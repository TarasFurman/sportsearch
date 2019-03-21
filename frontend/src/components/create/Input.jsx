import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ onChange, ...attributes }) => (
  <input onChange={onChange} className="form-control" {...attributes} />
);

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Input;
