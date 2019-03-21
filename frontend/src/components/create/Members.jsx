import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

const Members = ({ id, label, onChange }) => (
  <div className="form-row my-2">
    <span className="col-9 col-form-label">
      {label}
    </span>
    <div className="col-3">
      <Input onChange={onChange} id={id} type="number" min={1} />
    </div>
  </div>
);

Members.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Members;
