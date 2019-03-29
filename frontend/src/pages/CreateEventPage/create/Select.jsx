import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ sportTypes, handleChange, ...rest }) => {
  const options = sportTypes.map(sport => (
    <option key={sport.ids} value={sport.ids}>
      {sport.name}
    </option>
  ));

  return (
    <select onChange={handleChange} className="custom-select my-2" {...rest}>
      {options}
    </select>
  );
};

Select.propTypes = {
  sportTypes: PropTypes.instanceOf(Array).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Select;
