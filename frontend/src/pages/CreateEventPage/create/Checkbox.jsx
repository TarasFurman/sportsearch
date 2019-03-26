import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ id, name, onChange }) => (
  <div className="col-3">
    <div className="col-form-label custom-control custom-switch center-block">
      <input
        onChange={onChange}
        type="checkbox"
        className="custom-control-input"
        id={id}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
      <label className="custom-control-label" htmlFor={id}>
        {name}
      </label>
    </div>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
