import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({ onChange, ...rest }) => (
  <textarea
    onChange={onChange}
    style={{ resize: 'none' }}
    className="form-control my-2"
    placeholder="description..."
    rows="4"
    {...rest}
  />
);

Textarea.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Textarea;
